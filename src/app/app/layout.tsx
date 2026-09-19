import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { MobileNav } from "@/components/app/mobile-nav";
import { Topbar } from "@/components/app/topbar";
import { BrandLogo } from "@/components/ui/brand-logo";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: studio } = await supabase
    .from("studios")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!studio || !studio.onboarding_completo) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f7]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200/90 bg-white px-4 py-7 md:flex">
        <BrandLogo className="mb-9 px-2" />
        <div className="flex flex-1 flex-col">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar studio={studio} />
        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
