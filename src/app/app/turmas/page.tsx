import Link from "next/link";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { formatDiasSemana } from "@/components/app/dias-semana-picker";
import { todayISO } from "@/lib/utils/dates";

export default async function TurmasPage() {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: classes } = await supabase.from("classes").select("id, nome, modalidade, professor, horario, dias_semana, nivel").eq("studio_id", studio.id).eq("ativo", true).order("nome");
  const ids = (classes ?? []).map((item) => item.id);
  const { data: students } = ids.length ? await supabase.from("students").select("class_id").in("class_id", ids).eq("studio_id", studio.id).eq("ativo", true) : { data: [] };
  const counts = new Map<string, number>();
  (students ?? []).forEach((item) => { if (item.class_id) counts.set(item.class_id, (counts.get(item.class_id) ?? 0) + 1); });
  return <div className="flex flex-col gap-6"><header className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-rose-700">Agenda do studio</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Turmas</h1><p className="mt-1 text-sm text-ink-500">Horários, alunas e chamada em um só lugar.</p></div><ButtonLink href="/app/turmas/nova" className="shrink-0"><Icons.plus className="h-4 w-4"/><span className="hidden sm:inline">Nova turma</span><span className="sm:hidden">Adicionar</span></ButtonLink></header>{classes?.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{classes.map((item) => { const count = counts.get(item.id) ?? 0; return <article key={item.id} className="flex flex-col rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><Link href={`/app/turmas/${item.id}`} className="font-semibold text-ink-900 hover:text-rose-700">{item.nome}</Link><p className="mt-1 text-xs text-ink-500">{item.modalidade}{item.nivel ? ` · ${item.nivel}` : ""}</p></div><span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">{count} aluna{count === 1 ? "" : "s"}</span></div><div className="mt-5 space-y-2 text-sm text-ink-700"><p className="flex items-center gap-2"><Icons.clock className="h-4 w-4 text-ink-500"/>{formatDiasSemana(item.dias_semana)}{item.horario ? ` · ${item.horario}` : ""}</p>{item.professor && <p className="flex items-center gap-2"><Icons.students className="h-4 w-4 text-ink-500"/>Prof. {item.professor}</p>}</div><div className="mt-5 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-4"><ButtonLink href={`/app/presenca?turma=${item.id}&data=${todayISO()}`} size="sm">Fazer chamada</ButtonLink><ButtonLink href={`/app/turmas/${item.id}`} variant="secondary" size="sm">Ver turma</ButtonLink></div></article>; })}</div> : <EmptyState icon={<Icons.classes className="h-5 w-5"/>} title="Você ainda não criou nenhuma turma" description="Crie uma turma com dias e horário para começar a organizar suas aulas." action={<ButtonLink href="/app/turmas/nova">Criar primeira turma</ButtonLink>}/>}</div>;
}
