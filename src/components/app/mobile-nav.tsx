"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";

const ITEMS = [
  { href: "/app/dashboard", label: "Início", icon: Icons.home },
  { href: "/app/alunas", label: "Alunas", icon: Icons.students },
  { href: "/app/turmas", label: "Turmas", icon: Icons.classes },
  { href: "/app/presenca", label: "Chamada", icon: Icons.attendance },
  { href: "/app/mensalidades", label: "Mensalidades", icon: Icons.payments },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-neutral-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(33,27,30,.06)] backdrop-blur-xl md:hidden" aria-label="Navegação principal">{ITEMS.map((item) => { const active = pathname === item.href || pathname.startsWith(item.href + "/"); const ItemIcon = item.icon; return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-[64px] flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold transition ${active ? "text-rose-700" : "text-ink-500"}`}><span className={`rounded-lg p-1 transition ${active ? "bg-rose-50" : ""}`}><ItemIcon className="h-5 w-5"/></span><span className="max-w-full truncate">{item.label}</span></Link>; })}</nav>;
}
