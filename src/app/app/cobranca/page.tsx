import Link from "next/link";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { BillingQueue, type QueueItem } from "@/components/app/billing-queue";
import { startOfMonthISO, todayISO } from "@/lib/utils/dates";
import type { PaymentStatus } from "@/lib/types/database";

type RawPayment = {
  id: string;
  valor: number;
  vencimento: string;
  status: string;
  referencia_mes: string;
  students: {
    id: string;
    nome: string;
    responsavel_nome: string | null;
    telefone_responsavel: string | null;
    classes: { nome: string } | null;
  } | null;
};

export default async function CobrancaPage() {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const referenciaMes = startOfMonthISO();
  const today = todayISO();

  const { data: raw } = await supabase
    .from("payments")
    .select(
      "id, valor, vencimento, status, referencia_mes, students(id, nome, responsavel_nome, telefone_responsavel, classes(nome))"
    )
    .eq("studio_id", studio.id)
    .eq("referencia_mes", referenciaMes)
    .in("status", ["pendente", "atrasado"])
    .order("vencimento");

  const studentIds = ((raw ?? []) as unknown as RawPayment[])
    .map((p) => p.students?.id)
    .filter((id): id is string => Boolean(id));

  const { data: billingLogs } = studentIds.length
    ? await supabase
        .from("billing_log")
        .select("student_id, enviado_em")
        .eq("studio_id", studio.id)
        .in("student_id", studentIds)
        .order("enviado_em", { ascending: false })
    : { data: [] };

  const ultimaCobrancaPorAluna = new Map<string, string>();
  (billingLogs ?? []).forEach((log) => {
    if (!ultimaCobrancaPorAluna.has(log.student_id)) {
      ultimaCobrancaPorAluna.set(log.student_id, log.enviado_em);
    }
  });

  const items: QueueItem[] = ((raw ?? []) as unknown as RawPayment[])
    .filter((p) => p.students)
    .map((p) => {
      const status: PaymentStatus =
        p.status === "pendente" && p.vencimento < today ? "atrasado" : (p.status as PaymentStatus);
      return {
        paymentId: p.id,
        studentId: p.students!.id,
        alunaNome: p.students!.nome,
        turmaNome: p.students!.classes?.nome ?? "Sem turma",
        responsavelNome: p.students!.responsavel_nome,
        telefoneResponsavel: p.students!.telefone_responsavel,
        valor: Number(p.valor),
        vencimento: p.vencimento,
        referenciaMes: p.referencia_mes,
        status,
        ultimaCobranca: ultimaCobrancaPorAluna.get(p.students!.id) ?? null,
      };
    })
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "atrasado" ? -1 : 1));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-rose-700">Central de cobrança</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Cobre todo mundo em poucos toques
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          O sistema já separou quem está pendente ou atrasada este mês.
        </p>
      </div>

      <Card className="bg-rose-50/60">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-rose-700">
            <Icons.whatsapp className="h-4 w-4" />
          </div>
          <div className="text-sm leading-6 text-ink-700">
            <p>
              <strong>Como funciona:</strong> para cada aluna abaixo, a mensagem já vem
              pronta a partir do seu modelo de cobrança — você pode editar o texto na
              hora, se quiser, antes de enviar. Ao clicar em{" "}
              <strong>Enviar no WhatsApp</strong>, o sistema abre o WhatsApp com a
              mensagem preenchida no número do responsável cadastrado; você só confirma
              o envio. O WhatsApp não permite que nenhum sistema envie mensagens
              sozinho sem a sua ação — por isso o clique final é sempre seu, mas todo o
              resto (separar quem deve, montar a mensagem certa) já foi feito
              automaticamente.
            </p>
            <p className="mt-2">
              Quer mudar o texto padrão usado aqui?{" "}
              <Link href="/app/perfil" className="font-semibold text-rose-700 hover:underline">
                Edite em Meu perfil
              </Link>
              .
            </p>
          </div>
        </div>
      </Card>

      {items.length > 0 ? (
        <BillingQueue items={items} template={studio.mensagem_cobranca_template} studioNome={studio.nome} />
      ) : (
        <EmptyState
          icon={<Icons.check className="h-5 w-5" />}
          title="Ninguém pendente este mês"
          description="Todas as mensalidades geradas para este mês já estão pagas, ou ainda não foram geradas."
          action={
            <Link
              href="/app/mensalidades"
              className="text-sm font-semibold text-rose-700 hover:underline"
            >
              Ver mensalidades →
            </Link>
          }
        />
      )}
    </div>
  );
}
