"use client";

import { useTransition } from "react";
import { updateStudioProfile } from "@/app/app/perfil/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Studio } from "@/lib/types/database";

export function ProfileForm({ studio }: { studio: Studio }) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateStudioProfile(formData);
      toast(result.message, result.success ? "success" : "error");
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nome do studio" name="nome" defaultValue={studio.nome} required />
      <Input
        label="Seu nome (responsável)"
        name="responsavel_nome"
        defaultValue={studio.responsavel_nome ?? ""}
      />
      <Input label="Telefone" name="telefone" defaultValue={studio.telefone ?? ""} />
      <Input label="Cidade" name="cidade" defaultValue={studio.cidade ?? ""} />
      <Button type="submit" disabled={isPending} className="mt-2 w-full">
        {isPending ? "Salvando…" : "Salvar alterações"}
      </Button>
    </form>
  );
}
