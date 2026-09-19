import Link from "next/link";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { PaymentsView, type PaymentItem } from "@/components/app/payment-row";
import { GerarMensalidadesButton } from "@/components/app/gerar-mensalidades-button";
import { ExportPaymentsButton } from "@/components/app/export-payments-button";
import { formatCurrency, formatMonthName } from "@/lib/utils/format";
import { startOfMonthISO, todayISO } from "@/lib/utils/dates";
import type { PaymentStatus } from "@/lib/types/database";

type RawPayment = { id: string; valor: number; vencimento: string; status: string; referencia_mes: string; data_pagamento: string | null; students: { id: string; nome: string; responsavel_nome: string | null; telefone_responsavel: string | null; class_id: string | null; classes: { nome: string } | null } | null };

function queryString(values: Record<string, string | undefined>) { const params = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (value) params.set(key, value); }); return params.toString(); }

export default async function MensalidadesPage({ searchParams }: { searchParams: Promise<{ mes?: string; status?: string; turma?: string }> }) {
  const { mes, status = "", turma: turmaId = "" } = await searchParams;
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const referenciaMes = mes ? (mes.length === 7 ? `${mes}-01` : mes) : startOfMonthISO();
  const [{ data: turmas }, { data: raw }] = await Promise.all([
    supabase.from("classes").select("id, nome").eq("studio_id", studio.id).eq("ativo", true).order("nome"),
    supabase.from("payments").select("id, valor, vencimento, status, referencia_mes, data_pagamento, students(id, nome, responsavel_nome, telefone_responsavel, class_id, classes(nome))").eq("studio_id", studio.id).eq("referencia_mes", referenciaMes).order("vencimento"),
  ]);
  const today = todayISO();
  const allItems: PaymentItem[] = ((raw ?? []) as unknown as RawPayment[]).map((payment) => ({ id: payment.id, studentId: payment.students?.id ?? null, alunaNome: payment.students?.nome ?? "Aluna removida", turmaNome: payment.students?.classes?.nome ?? "Sem turma", responsavelNome: payment.students?.responsavel_nome ?? null, telefoneResponsavel: payment.students?.telefone_responsavel ?? null, valor: Number(payment.valor), vencimento: payment.vencimento, status: (payment.status === "pendente" && payment.vencimento < today ? "atrasado" : payment.status) as PaymentStatus, referenciaMes: payment.referencia_mes, dataPagamento: payment.data_pagamento }));
  const turmaItems = turmaId ? allItems.filter((item) => { const source = ((raw ?? []) as unknown as RawPayment[]).find((entry) => entry.id === item.id); return source?.students?.class_id === turmaId; }) : allItems;
  const items = status ? turmaItems.filter((item) => item.status === status) : turmaItems;
  const previsto = turmaItems.reduce((sum, item) => sum + item.valor, 0);
  const recebido = turmaItems.filter((item) => item.status === "pago").reduce((sum, item) => sum + item.valor, 0);
  const atrasados = turmaItems.filter((item) => item.status === "atrasado");
  const atrasadoValor = atrasados.reduce((sum, item) => sum + item.valor, 0);
  const exportHref = `/app/mensalidades/exportar?${queryString({ mes: referenciaMes.slice(0, 7), status: status || undefined, turma: turmaId || undefined })}`;
  const filters = [{ value: "", label: "Todas", count: turmaItems.length }, { value: "pendente", label: "Pendentes", count: turmaItems.filter((i) => i.status === "pendente").length }, { value: "atrasado", label: "Atrasadas", count: atrasados.length }, { value: "pago", label: "Pagas", count: turmaItems.filter((i) => i.status === "pago").length }];

  return <div className="flex flex-col gap-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-rose-700">Seu financeiro</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Mensalidades</h1><p className="mt-1 text-sm text-ink-500">Veja quem pagou e cobre quem ainda está devendo.</p></div><div className="flex flex-wrap gap-2"><Link href="/app/cobranca" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#18864b] px-4 text-sm font-semibold text-white hover:bg-[#116d3c]"><Icons.whatsapp className="h-4 w-4"/>Central de cobrança</Link><ExportPaymentsButton href={exportHref}/><GerarMensalidadesButton referenciaMes={referenciaMes}/></div></header>

    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Card className="p-4"><p className="text-xs font-medium text-ink-500">Previsto</p><p className="mt-2 text-xl font-semibold tracking-tight">{formatCurrency(previsto)}</p></Card><Card className="p-4"><p className="text-xs font-medium text-ink-500">Recebido</p><p className="mt-2 text-xl font-semibold tracking-tight text-success">{formatCurrency(recebido)}</p></Card><Card className="p-4"><p className="text-xs font-medium text-ink-500">Pendente</p><p className="mt-2 text-xl font-semibold tracking-tight text-warning">{formatCurrency(Math.max(previsto - recebido, 0))}</p></Card><Card className="border-red-100 bg-red-50/60 p-4"><p className="text-xs font-medium text-danger">Em atraso</p><p className="mt-2 text-xl font-semibold tracking-tight text-danger">{formatCurrency(atrasadoValor)}</p><p className="mt-1 text-xs text-danger">{atrasados.length} mensalidade{atrasados.length === 1 ? "" : "s"}</p></Card></section>

    <section className="space-y-3"><div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por status">{filters.map((filter) => <Link key={filter.value || "all"} href={`/app/mensalidades?${queryString({ mes: referenciaMes.slice(0, 7), turma: turmaId || undefined, status: filter.value || undefined })}`} aria-current={status === filter.value ? "page" : undefined} className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${status === filter.value ? "border-rose-700 bg-rose-700 text-white" : "border-neutral-200 bg-white text-ink-500 hover:border-rose-200 hover:text-rose-700"}`}>{filter.label} <span className={status === filter.value ? "text-rose-100" : "text-ink-500"}>{filter.count}</span></Link>)}</div><form className="grid gap-2 rounded-xl border border-neutral-200/90 bg-white p-3 sm:grid-cols-[180px_minmax(180px,260px)_auto]" action="/app/mensalidades"><input type="month" name="mes" defaultValue={referenciaMes.slice(0, 7)} aria-label="Mês" className="min-h-10 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"/><select name="turma" defaultValue={turmaId} aria-label="Turma" className="min-h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"><option value="">Todas as turmas</option>{(turmas ?? []).map((turma) => <option key={turma.id} value={turma.id}>{turma.nome}</option>)}</select>{status && <input type="hidden" name="status" value={status}/>}<button type="submit" className="min-h-10 rounded-lg bg-rose-50 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-100">Aplicar filtros</button></form></section>

    <div className="flex items-center justify-between"><p className="text-sm font-semibold text-ink-900">{formatMonthName(referenciaMes)}</p><p className="text-xs text-ink-500">{items.length} resultado{items.length === 1 ? "" : "s"}</p></div>
    {items.length ? <PaymentsView items={items} template={studio.mensagem_cobranca_template} studioNome={studio.nome}/> : <EmptyState icon={<Icons.payments className="h-5 w-5"/>} title={status === "pago" ? "Nenhum pagamento confirmado" : status ? `Nenhuma mensalidade ${status}` : "Nenhuma mensalidade neste mês"} description={status ? "Experimente outro filtro ou escolha outro mês." : "Gere as mensalidades a partir das alunas cadastradas."} action={!status ? <GerarMensalidadesButton referenciaMes={referenciaMes}/> : undefined}/>} 
  </div>;
}
