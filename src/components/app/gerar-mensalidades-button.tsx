"use client";

import { useTransition } from "react";
import { gerarMensalidadesDoMes } from "@/app/app/mensalidades/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function GerarMensalidadesButton({ referenciaMes }: { referenciaMes: string }) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  return <Button variant="secondary" size="sm" disabled={isPending} onClick={() => startTransition(async () => { const result = await gerarMensalidadesDoMes(referenciaMes); toast(result.message, result.success ? "success" : "error"); })}>{isPending ? "Gerando…" : "Gerar mensalidades"}</Button>;
}
