"use client";

import { useState, useTransition } from "react";
import { updateBillingMessageTemplate } from "@/app/app/perfil/actions";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { renderBillingMessage, BILLING_SLUGS } from "@/lib/utils/billing-message";

export function BillingTemplateForm({
  template,
  studioNome,
}: {
  template: string;
  studioNome: string;
}) {
  const [value, setValue] = useState(template);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateBillingMessageTemplate(formData);
      toast(result.message, result.success ? "success" : "error");
    });
  }

  const preview = renderBillingMessage(value, {
    alunaNome: "Marina Souza",
    responsavelNome: "Ana Souza",
    valor: 150,
    vencimento: new Date().toISOString().slice(0, 10),
    referenciaMes: new Date().toISOString().slice(0, 10),
    status: "atrasado",
    studioNome,
  });

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        label="Mensagem de cobrança"
        name="mensagem_cobranca_template"
        rows={7}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        hint="Use as variáveis abaixo — elas são substituídas automaticamente para cada aluna."
      />

      <div className="flex flex-wrap gap-1.5">
        {BILLING_SLUGS.map((item) => (
          <button
            key={item.slug}
            type="button"
            title={item.description}
            onClick={() => setValue((prev) => `${prev}${item.slug}`)}
            className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 font-mono text-xs font-medium text-rose-700 hover:bg-rose-100"
          >
            {item.slug}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-900">Como vai ficar</p>
        <div className="whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-sm text-ink-700">
          {preview}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="mt-1 w-full">
        {isPending ? "Salvando…" : "Salvar mensagem"}
      </Button>
    </form>
  );
}
