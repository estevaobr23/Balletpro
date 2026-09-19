import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { DiasSemanaPicker, formatDiasSemana } from "@/components/app/dias-semana-picker";
import { DeactivateClassButton } from "@/components/app/deactivate-class-button";
import { formatDate } from "@/lib/utils/format";
import { todayISO } from "@/lib/utils/dates";
import { updateClass, deleteClass } from "../actions";

export default async function TurmaDetalhePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string }> }) {
  const { id } = await params;
  const { erro } = await searchParams;
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: turma } = await supabase.from("classes").select("*").eq("id", id).eq("studio_id", studio.id).maybeSingle();
  if (!turma) notFound();
  const [{ data: students }, { data: attendance }] = await Promise.all([supabase.from("students").select("id, nome").eq("class_id", turma.id).eq("studio_id", studio.id).eq("ativo", true).order("nome"), supabase.from("attendance").select("data, student_id").eq("class_id", turma.id).eq("studio_id", studio.id).order("data", { ascending: false }).limit(100)]);
  const attendanceByDate = new Map<string, number>();
  (attendance ?? []).forEach((item) => attendanceByDate.set(item.data, (attendanceByDate.get(item.data) ?? 0) + 1));
  const recent = Array.from(attendanceByDate.entries()).slice(0, 5);
  const updateWithId = updateClass.bind(null, turma.id);
  const deactivateWithId = deleteClass.bind(null, turma.id);
  return <div className="mx-auto flex max-w-4xl flex-col gap-6"><Link href="/app/turmas" className="text-sm font-semibold text-ink-500 hover:text-rose-700">← Voltar para turmas</Link><header className="flex flex-col gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7"><div><p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Turma</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">{turma.nome}</h1><p className="mt-2 text-sm text-ink-500">{turma.modalidade}{turma.nivel ? ` · ${turma.nivel}` : ""} · {formatDiasSemana(turma.dias_semana)}{turma.horario ? ` às ${turma.horario}` : ""}</p></div><Link href={`/app/presenca?turma=${turma.id}&data=${todayISO()}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-700 px-5 text-sm font-semibold text-white hover:bg-rose-800"><Icons.attendance className="h-4 w-4"/>Fazer chamada</Link></header>
    <section className="grid gap-3 sm:grid-cols-3"><Card className="p-4"><p className="text-xs text-ink-500">Alunas ativas</p><p className="mt-2 text-xl font-semibold">{students?.length ?? 0}</p></Card><Card className="p-4"><p className="text-xs text-ink-500">Professora</p><p className="mt-2 text-sm font-semibold">{turma.professor ?? "Não informada"}</p></Card><Card className="p-4"><p className="text-xs text-ink-500">Faixa etária</p><p className="mt-2 text-sm font-semibold">{turma.faixa_etaria ?? "Não informada"}</p></Card></section>
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Alunas da turma</h2><Link href={`/app/alunas/nova?turma=${turma.id}`} className="text-xs font-semibold text-rose-700">Adicionar aluna</Link></div>{students?.length ? <Card className="p-0"><ul className="divide-y divide-neutral-100">{students.map((student) => <li key={student.id}><Link href={`/app/alunas/${student.id}`} className="flex items-center justify-between px-4 py-3 text-sm font-medium text-ink-700 hover:bg-neutral-50 hover:text-rose-700">{student.nome}<Icons.arrow className="h-4 w-4"/></Link></li>)}</ul></Card> : <EmptyState title="Nenhuma aluna nesta turma" description="Adicione a primeira aluna para liberar a chamada."/>}</section><section><h2 className="mb-3 font-semibold">Chamadas recentes</h2>{recent.length ? <Card className="p-0"><ul className="divide-y divide-neutral-100">{recent.map(([date, count]) => <li key={date} className="flex items-center justify-between px-4 py-3"><span className="text-sm text-ink-700">{formatDate(date)}</span><span className="text-xs font-semibold text-ink-500">{count} registros</span></li>)}</ul></Card> : <EmptyState title="Nenhuma chamada ainda" description="O histórico da turma aparecerá depois da primeira aula."/>}</section></div>
    <details className="group rounded-xl border border-neutral-200/90 bg-white shadow-sm" open={Boolean(erro)}><summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold"><span className="inline-flex items-center gap-2"><Icons.edit className="h-4 w-4 text-rose-700"/>Editar turma</span><span className="transition group-open:rotate-90">›</span></summary><div className="border-t border-neutral-100 p-5">{erro && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">{erro}</p>}<form action={updateWithId} className="grid gap-4 sm:grid-cols-2"><Input label="Nome da turma" name="nome" defaultValue={turma.nome} required/><Input label="Modalidade" name="modalidade" defaultValue={turma.modalidade}/><Input label="Nível" name="nivel" defaultValue={turma.nivel ?? ""}/><Input label="Professor(a)" name="professor" defaultValue={turma.professor ?? ""}/><Input label="Faixa etária" name="faixa_etaria" defaultValue={turma.faixa_etaria ?? ""}/><Input label="Horário" name="horario" defaultValue={turma.horario ?? ""}/><div className="sm:col-span-2"><DiasSemanaPicker defaultValue={turma.dias_semana}/></div><div className="sm:col-span-2"><Button type="submit">Salvar alterações</Button></div></form></div></details><form action={deactivateWithId} className="max-w-xs"><DeactivateClassButton/></form>
  </div>;
}
