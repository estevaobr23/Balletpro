"use client";

import { useTransition } from "react";
import { submitLeadEmail } from "@/app/app/novidades/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function LeadEmailForm({ defaultEmail }: { defaultEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitLeadEmail(formData);
      toast(result.message, result.success ? "success" : "error");
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label="Seu e-mail"
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          placeholder="voce@studio.com"
        />
      </div>
      <Button type="submit" disabled={isPending} className="sm:mb-0">
        {isPending ? "Salvando…" : "Quero receber"}
      </Button>
    </form>
  );
}
