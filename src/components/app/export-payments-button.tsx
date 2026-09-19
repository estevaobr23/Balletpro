"use client";

import { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";

export function ExportPaymentsButton({ href }: { href: string }) {
  const [pending, setPending] = useState(false);
  const toast = useToast();
  async function download() {
    setPending(true);
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error("export");
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const fileName = disposition.match(/filename="([^"]+)"/)?.[1] ?? "balletpro-mensalidades.csv";
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = fileName; anchor.click();
      URL.revokeObjectURL(url);
      toast("Planilha baixada com sucesso.");
    } catch { toast("Não foi possível gerar a planilha.", "error"); }
    finally { setPending(false); }
  }
  return <button type="button" disabled={pending} onClick={download} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-ink-700 transition hover:bg-neutral-50 disabled:opacity-60"><Icons.download className="h-4 w-4"/>{pending ? "Gerando…" : "Baixar planilha"}</button>;
}
