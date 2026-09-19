"use client";

import { useState, useTransition } from "react";
import { toggleDailyDigest } from "@/app/app/perfil/actions";
import { useToast } from "@/components/ui/toast";

export function DigestToggle({ initialValue }: { initialValue: boolean }) {
  const [enabled, setEnabled] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    startTransition(async () => {
      const result = await toggleDailyDigest(next);
      toast(result.message, result.success ? "success" : "error");
      if (!result.success) setEnabled(!next);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={isPending}
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
        enabled ? "bg-rose-600" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
