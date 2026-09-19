import { AccountMenu } from "@/components/app/account-menu";
import type { Studio } from "@/lib/types/database";

export function Topbar({ studio }: { studio: Studio }) {
  return (
    <header className="flex min-h-[68px] items-center justify-between border-b border-neutral-200/90 bg-white px-4 py-3 md:px-8">
      <div className="md:hidden">
        <p className="font-display text-lg font-semibold tracking-tight text-ink-900">
          {studio.nome}
        </p>
        {studio.cidade && (
          <p className="text-xs text-ink-500">{studio.cidade}</p>
        )}
      </div>
      <div className="hidden md:block" />
      <AccountMenu studio={studio} />
    </header>
  );
}
