"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { uploadStudioLogo, removeStudioLogo } from "@/app/app/perfil/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function LogoUploader({
  studioNome,
  logoUrl,
}: {
  studioNome: string;
  logoUrl: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(logoUrl);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.set("logo", file);

    startTransition(async () => {
      const result = await uploadStudioLogo(formData);
      toast(result.message, result.success ? "success" : "error");
      if (!result.success) setPreview(logoUrl);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeStudioLogo();
      toast(result.message, result.success ? "success" : "error");
      if (result.success) setPreview(null);
    });
  }

  const initials = studioNome
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-rose-50">
        {preview ? (
          <Image
            src={preview}
            alt={`Logo do ${studioNome}`}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span className="font-display text-2xl font-semibold text-rose-700">
            {initials || "?"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            {isPending ? "Enviando…" : preview ? "Trocar logo" : "Adicionar logo"}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={handleRemove}
            >
              Remover
            </Button>
          )}
        </div>
        <p className="text-xs text-ink-500">PNG, JPG, WEBP ou SVG — até 3MB.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
