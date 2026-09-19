import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { LeadEmailForm } from "@/components/app/lead-email-form";
import { formatDate } from "@/lib/utils/format";

export default async function NovidadesPage() {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const [{ data: updates }, { data: existingLead }] = await Promise.all([
    supabase
      .from("updates")
      .select("id, titulo, descricao, publicado_em")
      .order("publicado_em", { ascending: false }),
    supabase
      .from("leads")
      .select("email")
      .eq("studio_id", studio.id)
      .eq("origem", "novidades")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-rose-700">Novidades</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Atualizações do BalletPro
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Acompanhe o que está mudando no sistema.
        </p>
      </div>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-ink-900">
          Quer receber por e-mail também?
        </h2>
        <p className="mb-4 text-sm text-ink-500">
          Avisamos quando lançarmos algo novo — sem spam.
        </p>
        <LeadEmailForm defaultEmail={existingLead?.email ?? ""} />
      </Card>

      {updates && updates.length > 0 ? (
        <div className="flex flex-col gap-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <p className="text-xs font-medium text-ink-500">
                {formatDate(update.publicado_em.slice(0, 10))}
              </p>
              <h3 className="mt-1 text-base font-semibold text-ink-900">
                {update.titulo}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                {update.descricao}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Icons.alert className="h-5 w-5" />}
          title="Nenhuma novidade publicada ainda"
          description="Assim que lançarmos algo novo, você vê por aqui."
        />
      )}
    </div>
  );
}
