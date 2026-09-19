import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { StudentList, type StudentListItem } from "@/components/app/student-list";
import { startOfMonthISO, todayISO } from "@/lib/utils/dates";
import type { PaymentStatus } from "@/lib/types/database";

type RawStudent = { id: string; nome: string; responsavel_nome: string | null; mensalidade_valor: number; class_id: string | null; classes: { nome: string } | null };
export default async function AlunasPage() {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const [{ data: students }, { data: classes }] = await Promise.all([supabase.from("students").select("id, nome, responsavel_nome, mensalidade_valor, class_id, classes(nome)").eq("studio_id", studio.id).eq("ativo", true).order("nome"), supabase.from("classes").select("id, nome").eq("studio_id", studio.id).eq("ativo", true).order("nome")]);
  const studentIds = (students ?? []).map((item) => item.id);
  const { data: payments } = studentIds.length ? await supabase.from("payments").select("student_id, status, vencimento").in("student_id", studentIds).eq("referencia_mes", startOfMonthISO()) : { data: [] };
  const today = todayISO();
  const statusMap = new Map<string, PaymentStatus>();
  (payments ?? []).forEach((item) => statusMap.set(item.student_id, (item.status === "pendente" && item.vencimento < today ? "atrasado" : item.status) as PaymentStatus));
  const items: StudentListItem[] = ((students ?? []) as unknown as RawStudent[]).map((student) => ({ id: student.id, nome: student.nome, responsavel: student.responsavel_nome ?? "", turmaId: student.class_id ?? "", turma: student.classes?.nome ?? "Sem turma", mensalidade: Number(student.mensalidade_valor), status: statusMap.get(student.id) ?? null }));
  return <div className="flex flex-col gap-6"><header className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-rose-700">Pessoas do studio</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Alunas</h1><p className="mt-1 text-sm text-ink-500">Informações importantes sempre à mão.</p></div><ButtonLink href="/app/alunas/nova" className="shrink-0"><Icons.plus className="h-4 w-4"/><span className="hidden sm:inline">Nova aluna</span><span className="sm:hidden">Adicionar</span></ButtonLink></header><StudentList items={items} classes={classes ?? []}/></div>;
}
