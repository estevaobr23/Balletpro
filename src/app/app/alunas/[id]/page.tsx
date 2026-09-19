import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { DeactivateStudentButton } from "@/components/app/deactivate-student-button";
import { AttendanceHistory } from "@/components/app/attendance-history";
import { formatCurrency, formatDate, formatPhone, whatsappLink } from "@/lib/utils/format";
import { startOfMonthISO, todayISO } from "@/lib/utils/dates";
import { diasDeAtraso } from "@/lib/utils/payment-delay";
import { updateStudent, deactivateStudent } from "../actions";
import type { AttendanceStatus, PaymentStatus } from "@/lib/types/database";

export default async function AlunaDetalhePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string }> }) {
  const { id } = await params;
  const { erro } = await searchParams;
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: student } = await supabase.from("students").select("*").eq("id", id).eq("studio_id", studio.id).maybeSingle();
  if (!student) notFound();
  const [{ data: classes }, { data: payments }, { data: attendance }] = await Promise.all([
    supabase.from("classes").select("id, nome").eq("studio_id", studio.id).eq("ativo", true).order("nome"),
    supabase.from("payments").select("id, valor, vencimento, status, referencia_mes, data_pagamento").eq("student_id", student.id).eq("studio_id", studio.id).order("referencia_mes", { ascending: false }).limit(12),
    supabase.from("attendance").select("data, status").eq("student_id", student.id).eq("studio_id", studio.id).order("data", { ascending: false }).limit(12),
  ]);
  const currentClass = classes?.find((item) => item.id === student.class_id);
  const currentPayment = payments?.find((item) => item.referencia_mes === startOfMonthISO());
  const currentStatus = currentPayment ? (currentPayment.status === "pendente" && currentPayment.vencimento < todayISO() ? "atrasado" : currentPayment.status) as PaymentStatus : null;
  const whatsapp = student.telefone_responsavel ? whatsappLink(student.telefone_responsavel, `Olá${student.responsavel_nome ? `, ${student.responsavel_nome.split(" ")[0]}` : ""}! Tudo bem? Aqui é do ${studio.nome}.`) : null;

  const recentAttendance = (attendance ?? []).slice(0, 4);
  const recentFaltas = recentAttendance.filter((record) => record.status === "faltou").length;
  const temAlertaCruzado = currentStatus === "atrasado" && recentFaltas >= 2;
  const updateWithId = updateStudent.bind(null, student.id);
  const deactivateWithId = deactivateStudent.bind(null, student.id);
  return <div className="mx-auto flex max-w-4xl flex-col gap-6"><Link href="/app/alunas" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-rose-700">← Voltar para alunas</Link>
    <header className="flex flex-col gap-4 rounded-2xl bg-rose-800 p-5 text-white sm:flex-row sm:items-end sm:justify-between sm:p-7"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-rose-200">Ficha da aluna</p><div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="font-display text-3xl font-semibold tracking-tight">{student.nome}</h1>{currentStatus && <PaymentStatusBadge status={currentStatus}/>}</div><p className="mt-2 text-sm text-rose-100">{currentClass?.nome ?? "Sem turma"}</p></div>{whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-rose-800 hover:bg-rose-50"><Icons.whatsapp className="h-4 w-4"/>Chamar responsável</a>}</header>
    {temAlertaCruzado && <section className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><Icons.alert className="mt-0.5 h-5 w-5 shrink-0 text-warning"/><div><p className="text-sm font-semibold text-ink-900">Merece uma atenção especial</p><p className="mt-1 text-sm leading-6 text-ink-700">Mensalidade atrasada e {recentFaltas} falta{recentFaltas > 1 ? "s" : ""} nas últimas {recentAttendance.length} aulas. Pode valer uma conversa com a família antes de seguir só cobrando.</p></div></section>}
    <nav className="flex gap-2 overflow-x-auto border-b border-neutral-200 pb-2 text-sm font-semibold text-ink-500"><a href="#visao-geral" className="rounded-lg px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Visão geral</a><a href="#pagamentos" className="rounded-lg px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Pagamentos</a><a href="#presencas" className="rounded-lg px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Presenças</a><a href="#dados" className="rounded-lg px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Dados</a></nav>
    <section id="visao-geral" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Card className="p-4"><p className="text-xs font-medium text-ink-500">Responsável</p><p className="mt-2 text-sm font-semibold">{student.responsavel_nome ?? "Não informado"}</p></Card><Card className="p-4"><p className="text-xs font-medium text-ink-500">Telefone</p><p className="mt-2 text-sm font-semibold">{student.telefone_responsavel ? formatPhone(student.telefone_responsavel) : "Não informado"}</p></Card><Card className="p-4"><p className="text-xs font-medium text-ink-500">Mensalidade</p><p className="mt-2 text-sm font-semibold">{formatCurrency(Number(student.mensalidade_valor))}</p></Card><Card className="p-4"><p className="text-xs font-medium text-ink-500">Vencimento</p><p className="mt-2 text-sm font-semibold">Dia {student.dia_vencimento}</p></Card></section>
    {student.observacoes && <section className="rounded-xl border border-rose-100 bg-rose-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Observações</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-700">{student.observacoes}</p></section>}
    <div className="grid gap-6 lg:grid-cols-2"><section id="pagamentos"><h2 className="mb-3 font-semibold text-ink-900">Histórico de pagamentos</h2>{payments?.length ? <Card className="p-0"><ul className="divide-y divide-neutral-100">{payments.map((payment) => { const status = (payment.status === "pendente" && payment.vencimento < todayISO() ? "atrasado" : payment.status) as PaymentStatus; const atraso = payment.status === "pago" ? diasDeAtraso(payment.vencimento, payment.data_pagamento) : 0; return <li key={payment.id} className="flex items-center justify-between gap-3 px-4 py-3"><div><p className="text-sm font-semibold">{formatCurrency(Number(payment.valor))}</p><p className="text-xs text-ink-500">Venceu em {formatDate(payment.vencimento)}</p>{payment.status === "pago" && payment.data_pagamento && <p className={`text-xs ${atraso > 0 ? "text-warning" : "text-success"}`}>Pago em {formatDate(payment.data_pagamento)}{atraso > 0 ? ` · ${atraso} dia${atraso > 1 ? "s" : ""} de atraso` : " · em dia"}</p>}</div><PaymentStatusBadge status={status}/></li>; })}</ul></Card> : <EmptyState title="Sem pagamentos ainda" description="O histórico aparecerá depois que as mensalidades forem geradas."/>}</section><section id="presencas"><h2 className="mb-3 font-semibold text-ink-900">Histórico de presença</h2>{attendance?.length ? <Card className="p-0"><AttendanceHistory records={attendance as { data: string; status: AttendanceStatus }[]} alunaNome={student.nome} responsavelNome={student.responsavel_nome} telefoneResponsavel={student.telefone_responsavel} turmaNome={currentClass?.nome ?? "a turma"}/></Card> : <EmptyState title="Sem presenças registradas" description="As chamadas feitas para esta aluna aparecerão aqui."/>}</section></div>
    <section id="dados"><details className="group rounded-xl border border-neutral-200/90 bg-white shadow-sm" open={Boolean(erro)}><summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold text-ink-900"><span className="inline-flex items-center gap-2"><Icons.edit className="h-4 w-4 text-rose-700"/>Editar dados cadastrais</span><span className="text-ink-500 transition group-open:rotate-90">›</span></summary><div className="border-t border-neutral-100 p-5">{erro && <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-danger">{erro}</p>}<form action={updateWithId} className="grid gap-4 sm:grid-cols-2"><Input label="Nome da aluna" name="nome" defaultValue={student.nome} required/><Select label="Turma" name="class_id" defaultValue={student.class_id ?? ""}><option value="">Sem turma</option>{(classes ?? []).map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</Select><Input label="Data de nascimento" name="data_nascimento" type="date" defaultValue={student.data_nascimento ?? ""}/><Input label="Nome do responsável" name="responsavel_nome" defaultValue={student.responsavel_nome ?? ""}/><Input label="Telefone do responsável" name="telefone_responsavel" defaultValue={student.telefone_responsavel ?? ""}/><Input label="Mensalidade (R$)" name="mensalidade_valor" type="number" step="0.01" min="0" defaultValue={student.mensalidade_valor}/><Select label="Dia de vencimento" name="dia_vencimento" defaultValue={String(student.dia_vencimento)}>{Array.from({ length: 28 }, (_, i) => i + 1).map((day) => <option key={day} value={day}>Dia {day}</option>)}</Select><Textarea label="Observações" name="observacoes" rows={3} defaultValue={student.observacoes ?? ""} className="sm:min-h-24"/><div className="sm:col-span-2"><Button type="submit" className="w-full sm:w-auto">Salvar alterações</Button></div></form></div></details></section>
    <form action={deactivateWithId} className="max-w-xs"><DeactivateStudentButton/></form>
  </div>;
}
