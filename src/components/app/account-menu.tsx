"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/(auth)/actions";
import { Icons } from "@/components/ui/icons";
import type { Studio } from "@/lib/types/database";

const MENU_ITEMS = [
  { href: "/app/perfil", label: "Meu perfil", icon: Icons.user },
  { href: "/app/novidades", label: "Novidades", icon: Icons.megaphone },
  { href: "/app/instalar", label: "Instalar app", icon: Icons.download },
] as const;

export function AccountMenu({ studio }: { studio: Studio }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = studio.nome
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-neutral-50"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-rose-50">
          {studio.logo_url ? (
            <Image
              src={studio.logo_url}
              alt=""
              width={36}
              height={36}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span className="font-display text-sm font-semibold text-rose-700">
              {initials || "?"}
            </span>
          )}
        </div>
        <div className="hidden text-left sm:block">
          <p className="font-display text-sm font-semibold leading-tight tracking-tight text-ink-900">
            {studio.nome}
          </p>
          {studio.cidade && <p className="text-xs text-ink-500">{studio.cidade}</p>}
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg"
        >
          {MENU_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-neutral-50"
              >
                <ItemIcon className="h-4 w-4 text-ink-500" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-1 h-px bg-neutral-100" />
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition hover:bg-red-50"
            >
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
