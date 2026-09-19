import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { Card } from "@/components/ui/card";
import { LogoUploader } from "@/components/app/logo-uploader";
import { ProfileForm } from "@/components/app/profile-form";
import { BillingTemplateForm } from "@/components/app/billing-template-form";
import { DigestToggle } from "@/components/app/digest-toggle";

export default async function PerfilPage() {
  const studio = await getCurrentStudio();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-rose-700">Meu perfil</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Dados do seu studio
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          A logo aparece no topo do sistema e pode ser usada nas cobranças pelo WhatsApp.
        </p>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-ink-900">Logo do ateliê</h2>
        <LogoUploader studioNome={studio.nome} logoUrl={studio.logo_url} />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-ink-900">Informações do studio</h2>
        <ProfileForm studio={studio} />
      </Card>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-ink-900">
          Mensagem de cobrança
        </h2>
        <p className="mb-4 text-sm text-ink-500">
          Esse é o texto usado quando você cobra uma aluna pelo WhatsApp. Personalize
          do seu jeito.
        </p>
        <BillingTemplateForm
          template={studio.mensagem_cobranca_template}
          studioNome={studio.nome}
        />
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-ink-900">Resumo diário por e-mail</h2>
            <p className="mt-1 text-sm text-ink-500">
              Todo dia, se houver mensalidade atrasada ou aluna sumindo das aulas,
              avisamos no seu e-mail de cadastro.
            </p>
          </div>
          <DigestToggle initialValue={studio.receber_resumo_diario} />
        </div>
      </Card>
    </div>
  );
}
