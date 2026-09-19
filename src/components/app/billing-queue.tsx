"use client";

import { useMemo, useState, useTransition } from "react";
import { markPaymentAsPaidFromQueue } from "@/app/app/cobranca/actions";
import { logBillingSent } from "@/app/app/cobranca/log-actions";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { renderBillingMessage } from "@/lib/utils/billing-message";
import { formatCurrency, formatDate, whatsappLink } from "@/lib/utils/format";
import { formatRelativeDays } from "@/lib/utils/relative-time";
import type { PaymentStatus } from "@/lib/types/database";

export interface QueueItem {
  paymentId: string;
  studentId: string | null;
  alunaNome: string;
  turmaNome: string;
  responsavelNome: string | null;
  telefoneResponsavel: string | null;
  valor: number;
  vencimento: string;
  referenciaMes: string;
  status: PaymentStatus;
  ultimaCobranca: string | null;
}

function QueueCard({
  item,
  template,
  studioNome,
  sent,
  onMarkSent,
}: {
  item: QueueItem;
  template: string;
  studioNome: string;
  sent: boolean;
  onMarkSent: () => void;
}) {
  const defaultMessage = useMemo(
    () =>
      renderBillingMessage(template, {
        alunaNome: item.alunaNome,
        responsavelNome: item.responsavelNome,
        valor: item.valor,
        vencimento: item.vencimento,
        referenciaMes: item.referenciaMes,
        status: item.status,
        studioNome,
      }),
    [template, item, studioNome]
  );

  const [message, setMessage] = useState(defaultMessage);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const whatsapp = item.telefoneResponsavel
    ? whatsappLink(item.telefoneResponsavel, message)
    : null;

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        sent ? "border-green-200 bg-green-50/40" : "border-neutral-200/90"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">{item.alunaNome}</p>
          <p className="truncate text-xs text-ink-500">
            {item.turmaNome}
            {item.responsavelNome ? ` · ${item.responsavelNome}` : ""}
          </p>
        </div>
        <PaymentStatusBadge status={item.status} />
      </div>

      {item.ultimaCobranca && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
          <Icons.clock className="h-3.5 w-3.5" />
          Última cobrança {formatRelativeDays(item.ultimaCobranca)}
        </p>
      )}

      <div className="my-3 grid grid-cols-2 gap-3 rounded-lg bg-neutral-50 p-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
            Valor
          </p>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(item.valor)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
            Vencimento
          </p>
          <p className="mt-1 text-sm font-semibold">{formatDate(item.vencimento)}</p>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onMarkSent();
              if (item.studentId) {
                startTransition(() => logBillingSent(item.studentId!, item.paymentId));
              }
            }}
            className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition ${
              sent
                ? "border border-green-200 bg-green-50 text-green-700"
                : "bg-[#18864b] text-white hover:bg-[#116d3c]"
            }`}
          >
            <Icons.whatsapp className="h-4 w-4" />
            {sent ? "Enviado" : "Enviar no WhatsApp"}
          </a>
        ) : (
          <p className="text-xs text-danger">
            Sem telefone do responsável cadastrado.
          </p>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await markPaymentAsPaidFromQueue(item.paymentId);
              toast(result.message, result.success ? "success" : "error");
            })
          }
        >
          {isPending ? "Salvando…" : "Marcar como pago"}
        </Button>
      </div>
    </div>
  );
}

export function BillingQueue({
  items,
  template,
  studioNome,
}: {
  items: QueueItem[];
  template: string;
  studioNome: string;
}) {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  function markSent(paymentId: string) {
    setSentIds((prev) => new Set(prev).add(paymentId));
  }

  const pendentes = items.filter((item) => !sentIds.has(item.paymentId));
  const enviados = items.filter((item) => sentIds.has(item.paymentId));

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3">
        <p className="text-sm font-medium text-rose-800">
          {sentIds.size} de {items.length} cobranças enviadas nesta sessão
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[...pendentes, ...enviados].map((item) => (
          <QueueCard
            key={item.paymentId}
            item={item}
            template={template}
            studioNome={studioNome}
            sent={sentIds.has(item.paymentId)}
            onMarkSent={() => markSent(item.paymentId)}
          />
        ))}
      </div>
    </div>
  );
}
