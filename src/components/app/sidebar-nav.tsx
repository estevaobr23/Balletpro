"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";

const ITEMS = [
  { href: "/app/dashboard", label: "Início", icon: Icons.home },
  { href: "/app/alunas", label: "Alunas", icon: Icons.students },
  { href: "/app/turmas", label: "Turmas", icon: Icons.classes },
  { href: "/app/presenca", label: "Presenças", icon: Icons.attendance },
  { href: "/app/mensalidades", label: "Mensalidades", icon: Icons.payments },
  { href: "/app/cobranca", label: "Cobrança", icon: Icons.whatsapp },
] as const;

const SECONDARY_ITEMS = [
  { href: "/app/perfil", label: "Meu perfil", icon: Icons.user },
  { href: "/app/novidades", label: "Novidades", icon: Icons.megaphone },
  { href: "/app/instalar", label: "Instalar app", icon: Icons.download },
] as const;

function NavLink({
  href,
  label,
  icon: ItemIcon,
  active,
}: {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-rose-50 text-rose-800"
          : "text-ink-500 hover:bg-neutral-50 hover:text-ink-900"
      }`}
    >
      <ItemIcon className="h-[19px] w-[19px]" />
      <span>{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-rose-600" />}
    </Link>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex flex-1 flex-col justify-between">
      <nav className="flex flex-col gap-1" aria-label="Navegação principal">
        {ITEMS.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>

      <nav className="flex flex-col gap-1 border-t border-neutral-100 pt-4" aria-label="Conta">
        {SECONDARY_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>
    </div>
  );
}
