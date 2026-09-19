import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { AttendanceList } from "@/components/app/attendance-list";
import { PresenceTabs } from "@/components/app/presence-tabs";
import { todayISO } from "@/lib/utils/dates";
import { formatDate } from "@/lib/utils/format";
import type { AttendanceStatus } from "@/lib/types/database";

export default async function PresencaPage({ searchParams }: { searchParams: Promise<{ turma?: string; data?: string }> }) {
  const { turma: classParam, data: dateParam } = await searchParams;
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: classes } = await supabase.from("classes").select("id, nome, horario").eq("studio_id", studio.id).eq("ativo", true).order("nome");
  const classId = classParam || classes?.[0]?.id || "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateParam ?? "") ? dateParam! : todayISO();
  const selectedClass = classes?.find((item) => item.id === classId);
  let students: { id: string; nome: string }[] = [];
  let initialStatus: Record<string, AttendanceStatus> = {};
  if (classId) {
    const { data: studentRows } = await supabase.from("students").select("id, nome").eq("class_id", classId).eq("studio_id", studio.id).eq("ativo", true).order("nome");
    students = studentRows ?? [];
    if (students.length) { const { data: attendance } = await supabase.from("attendance").select("student_id, status").eq("studio_id", studio.id).eq("class_id", classId).eq("data", date); initialStatus = Object.fromEntries((attendance ?? []).map((item) => [item.student_id, item.status as AttendanceStatus])); }
  }
  return <div className="mx-auto flex max-w-3xl flex-col gap-6"><header><p className="text-sm font-medium text-rose-700">Rotina de aula</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Fazer chamada</h1><p className="mt-1 text-sm text-ink-500">{selectedClass ? `${selectedClass.nome} · ${formatDate(date)}` : "Escolha uma turma para começar."}</p></header>
    <PresenceTabs/>
    <form className="grid gap-2 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-sm sm:grid-cols-[1fr_180px_auto]" action="/app/presenca"><select name="turma" defaultValue={classId} aria-label="Turma" className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100">{(classes ?? []).map((item) => <option key={item.id} value={item.id}>{item.nome}{item.horario ? ` · ${item.horario}` : ""}</option>)}</select><input type="date" name="data" defaultValue={date} aria-label="Data" className="min-h-11 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"/><button type="submit" className="min-h-11 rounded-lg bg-rose-50 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-100">Abrir chamada</button></form>
    {!classes?.length ? <EmptyState icon={<Icons.classes className="h-5 w-5"/>} title="Crie sua primeira turma" description="A chamada começa a partir de uma turma com alunas." action={<ButtonLink href="/app/turmas/nova">Criar turma</ButtonLink>}/> : students.length ? <AttendanceList classId={classId} className={selectedClass?.nome ?? "Turma"} data={date} students={students} initialStatus={initialStatus}/> : <EmptyState icon={<Icons.students className="h-5 w-5"/>} title="Esta turma ainda não tem alunas" description="Cadastre uma aluna e vincule-a a esta turma para fazer a chamada." action={<ButtonLink href="/app/alunas/nova">Cadastrar aluna</ButtonLink>}/>} 
  </div>;
}
