import Link from "next/link";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { formatCurrency, formatMonthName } from "@/lib/utils/format";
import { startOfMonthISO, todayISO } from "@/lib/utils/dates";
import { InspirationBanner } from "@/components/app/inspiration-banner";

const DAYS = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

function humanDate(date: Date) {
  const text = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default async function DashboardPage() {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const now = new Date();
  const mesAtual = startOfMonthISO(now);
  const hoje = todayISO(now);
  const future = new Date(now);
  future.setDate(future.getDate() + 5);
  const limiteVencimento = todayISO(future);
  const nomeDiaHoje = DAYS[now.getDay()];

  const [{ count: alunasAtivas }, { count: turmasCount }, { data: pagamentosMes }, { data: turmasHoje }, { data: alunosTurmas }, { count: attendanceCount }] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("studio_id", studio.id).eq("ativo", true),
    supabase.from("classes").select("id", { count: "exact", head: true }).eq("studio_id", studio.id).eq("ativo", true),
    supabase.from("payments").select("id, valor, status, vencimento").eq("studio_id", studio.id).eq("referencia_mes", mesAtual),
    supabase.from("classes").select("id, nome, horario, dias_semana").eq("studio_id", studio.id).eq("ativo", true).contains("dias_semana", [nomeDiaHoje]).order("horario"),
    supabase.from("students").select("id, class_id").eq("studio_id", studio.id).eq("ativo", true),
    supabase.from("attendance").select("id", { count: "exact", head: true }).eq("studio_id", studio.id),
  ]);

  const classIds = (turmasHoje ?? []).map((item) => item.id);
  const { data: presencasHoje } = classIds.length
    ? await supabase.from("attendance").select("class_id, student_id").eq("studio_id", studio.id).eq("data", hoje).in("class_id", classIds)
    : { data: [] };

  const payments = pagamentosMes ?? [];
  const previsto = payments.reduce((sum, p) => sum + Number(p.valor), 0);
  const recebido = payments.filter((p) => p.status === "pago").reduce((sum, p) => sum + Number(p.valor), 0);
  const atrasadas = payments.filter((p) => p.status === "atrasado" || (p.status === "pendente" && p.vencimento < hoje));
  const vencendo = payments.filter((p) => p.status === "pendente" && p.vencimento >= hoje && p.vencimento <= limiteVencimento);

  const studentsByClass = new Map<string, number>();
  (alunosTurmas ?? []).forEach((student) => { if (student.class_id) studentsByClass.set(student.class_id, (studentsByClass.get(student.class_id) ?? 0) + 1); });
  const attendanceByClass = new Map<string, number>();
  (presencasHoje ?? []).forEach((record) => attendanceByClass.set(record.class_id, (attendanceByClass.get(record.class_id) ?? 0) + 1));
  const callsPending = (turmasHoje ?? []).filter((item) => (studentsByClass.get(item.id) ?? 0) > (attendanceByClass.get(item.id) ?? 0));
  const allClear = atrasadas.length === 0 && vencendo.length === 0 && callsPending.length === 0;
  const setupSteps = [
    { label: "Cadastre turma e aluna", done: Boolean((turmasCount ?? 0) > 0 && (alunasAtivas ?? 0) > 0), href: "/app/alunas/nova" },
    { label: "Gere as mensalidades", done: payments.length > 0, href: "/app/mensalidades" },
    { label: "Faça a primeira chamada", done: Boolean((attendanceCount ?? 0) > 0), href: "/app/presenca" },
  ];
  const setupDone = setupSteps.filter((step) => step.done).length;
  const firstName = studio.responsavel_nome?.split(" ")[0] ?? "bem-vinda";

  return <div className="flex flex-col gap-7">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-rose-700">{humanDate(now)}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Olá, {firstName}. Este é o seu studio hoje.</h1><p className="mt-1 text-sm text-ink-500">Visão geral de {formatMonthName(mesAtual)}</p></div>
      <ButtonLink href="/app/alunas/nova" className="w-full sm:w-auto"><Icons.plus className="h-4 w-4"/>Adicionar aluna</ButtonLink>
    </header>

    <InspirationBanner />

    {setupDone < setupSteps.length && <section className="rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-rose-700">Primeiros passos · {setupDone}/{setupSteps.length}</p><h2 className="mt-1 font-semibold text-ink-900">Deixe seu BalletPro pronto para a rotina</h2></div><div className="flex flex-wrap gap-2">{setupSteps.map((step) => <Link key={step.label} href={step.href} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${step.done ? "border-green-200 bg-green-50 text-success" : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"}`}>{step.done ? <Icons.check className="h-3.5 w-3.5"/> : <span className="h-1.5 w-1.5 rounded-full bg-current"/>}{step.label}</Link>)}</div></div></section>}

    <section aria-labelledby="financeiro-title"><div className="mb-3 flex items-center justify-between"><h2 id="financeiro-title" className="text-sm font-semibold text-ink-900">Resumo financeiro</h2><Link href="/app/mensalidades" className="text-xs font-semibold text-rose-700 hover:underline">Ver mensalidades</Link></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><StatCard label="Previsto" value={formatCurrency(previsto)}/><StatCard label="Recebido" value={formatCurrency(recebido)} tone="success"/><StatCard label="Pendente" value={formatCurrency(Math.max(previsto - recebido, 0))} tone="warning"/><StatCard label="Atrasadas" value={String(atrasadas.length)} tone={atrasadas.length ? "danger" : "default"}/></div></section>

    {allClear ? <section className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-success shadow-sm"><Icons.check className="h-5 w-5"/></span><div><h2 className="font-semibold text-success">Tudo em dia por aqui</h2><p className="mt-0.5 text-sm text-ink-500">Nenhuma cobrança ou chamada precisa da sua atenção agora.</p></div></section> : <section className="rounded-xl border border-rose-100 bg-white p-5 shadow-sm" aria-labelledby="attention-title"><div className="mb-4 flex items-center gap-2"><Icons.alert className="h-5 w-5 text-rose-700"/><h2 id="attention-title" className="font-semibold text-ink-900">Precisa da sua atenção</h2></div><div className="grid gap-3 md:grid-cols-3">{atrasadas.length > 0 && <Link href="/app/cobranca" className="group rounded-xl bg-red-50 p-4 transition hover:bg-red-100"><p className="text-2xl font-semibold text-danger">{atrasadas.length}</p><p className="mt-1 text-sm font-medium text-ink-900">mensalidade{atrasadas.length > 1 ? "s" : ""} atrasada{atrasadas.length > 1 ? "s" : ""}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-danger">Cobrar agora <Icons.arrow className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"/></span></Link>}{vencendo.length > 0 && <Link href="/app/mensalidades?status=pendente" className="group rounded-xl bg-amber-50 p-4 transition hover:bg-amber-100"><p className="text-2xl font-semibold text-warning">{vencendo.length}</p><p className="mt-1 text-sm font-medium text-ink-900">vencendo nos próximos dias</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-warning">Acompanhar <Icons.arrow className="h-3.5 w-3.5"/></span></Link>}{callsPending.length > 0 && <Link href={`/app/presenca?turma=${callsPending[0].id}&data=${hoje}`} className="group rounded-xl bg-rose-50 p-4 transition hover:bg-rose-100"><p className="text-2xl font-semibold text-rose-700">{callsPending.length}</p><p className="mt-1 text-sm font-medium text-ink-900">chamada{callsPending.length > 1 ? "s" : ""} de hoje em aberto</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-700">Fazer chamada <Icons.arrow className="h-3.5 w-3.5"/></span></Link>}</div></section>}

    <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
      <section className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm" aria-labelledby="today-title"><div className="mb-4 flex items-center justify-between"><div><h2 id="today-title" className="font-semibold text-ink-900">Turmas de hoje</h2><p className="text-xs text-ink-500">Acesse a chamada sem procurar pela turma.</p></div><Icons.clock className="h-5 w-5 text-rose-600"/></div>{turmasHoje?.length ? <ul className="divide-y divide-neutral-100">{turmasHoje.map((turma) => { const students = studentsByClass.get(turma.id) ?? 0; const marked = attendanceByClass.get(turma.id) ?? 0; const complete = students > 0 && marked >= students; return <li key={turma.id} className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-0"><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink-900">{turma.nome}</p><p className="mt-0.5 text-xs text-ink-500">{turma.horario ?? "Sem horário"} · {students} aluna{students === 1 ? "" : "s"}</p></div>{complete ? <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-success"><Icons.check className="h-3.5 w-3.5"/>Concluída</span> : <ButtonLink href={`/app/presenca?turma=${turma.id}&data=${hoje}`} variant="secondary" size="sm">Fazer chamada</ButtonLink>}</li>; })}</ul> : <div className="py-8 text-center"><p className="text-sm font-medium text-ink-900">Hoje não há turmas programadas.</p><p className="mt-1 text-xs text-ink-500">Um respiro na agenda do studio.</p></div>}</section>

      <section className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm" aria-labelledby="quick-title"><h2 id="quick-title" className="font-semibold text-ink-900">Ações rápidas</h2><div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1"><ButtonLink href="/app/alunas/nova" variant="secondary" className="justify-start"><Icons.students className="h-4 w-4"/>Nova aluna</ButtonLink><ButtonLink href="/app/turmas/nova" variant="secondary" className="justify-start"><Icons.classes className="h-4 w-4"/>Nova turma</ButtonLink><ButtonLink href="/app/presenca" variant="secondary" className="justify-start"><Icons.attendance className="h-4 w-4"/>Fazer chamada</ButtonLink><ButtonLink href="/app/cobranca" variant="secondary" className="justify-start"><Icons.whatsapp className="h-4 w-4"/>Cobrar pendentes</ButtonLink></div><div className="mt-5 border-t border-neutral-100 pt-4 text-xs text-ink-500"><span className="font-semibold text-ink-900">{alunasAtivas ?? 0}</span> alunas ativas · <span className="font-semibold text-ink-900">{turmasCount ?? 0}</span> turmas</div></section>
    </div>
  </div>;
}
