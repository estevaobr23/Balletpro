import { Card } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

const PASSOS_IOS = [
  "Abra o BalletPro pelo Safari (não funciona pelo Chrome no iPhone).",
  'Toque no ícone de compartilhar (o quadrado com uma seta para cima), na barra inferior.',
  'Role para baixo e toque em "Adicionar à Tela de Início".',
  'Toque em "Adicionar" no canto superior direito.',
];

const PASSOS_ANDROID = [
  "Abra o BalletPro pelo Google Chrome.",
  "Toque nos três pontinhos no canto superior direito.",
  'Toque em "Adicionar à tela inicial" (ou "Instalar app").',
  'Confirme tocando em "Adicionar" ou "Instalar".',
];

const PASSOS_DESKTOP = [
  "Abra o BalletPro pelo Google Chrome ou Edge no computador.",
  "Clique no ícone de instalação na barra de endereço (geralmente um monitor com uma seta).",
  'Clique em "Instalar".',
  "O BalletPro abre como um app separado, com atalho no seu computador.",
];

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-50 font-display text-sm font-semibold text-rose-700">
            {index + 1}
          </span>
          <p className="pt-0.5 text-sm leading-6 text-ink-700">{step}</p>
        </li>
      ))}
    </ol>
  );
}

export default function InstalarPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-rose-700">Instalar aplicativo</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Tenha o BalletPro na tela do seu celular
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Instale o sistema como um aplicativo — sem precisar de loja de apps. Abre
          rápido, direto da tela inicial, como qualquer outro app.
        </p>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <Icons.download className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold text-ink-900">iPhone (Safari)</h2>
        </div>
        <StepList steps={PASSOS_IOS} />
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <Icons.download className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold text-ink-900">Android (Chrome)</h2>
        </div>
        <StepList steps={PASSOS_ANDROID} />
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <Icons.download className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold text-ink-900">Computador</h2>
        </div>
        <StepList steps={PASSOS_DESKTOP} />
      </Card>
    </div>
  );
}
