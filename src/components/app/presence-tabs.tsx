"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/app/presenca", label: "Fazer chamada" },
  { href: "/app/presenca/historico", label: "Histórico" },
] as const;

export function PresenceTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 rounded-xl border border-neutral-200/90 bg-white p-1 shadow-sm">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold transition ${
              active ? "bg-rose-700 text-white" : "text-ink-500 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
