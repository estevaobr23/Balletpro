import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createStudio,
  createFirstClass,
  createFirstStudent,
  skipOnboardingStep,
} from "./actions";
import { BrandLogo } from "@/components/ui/brand-logo";

const DIAS = [
  { value: "segunda", label: "Seg" },
  { value: "terca", label: "Ter" },
  { value: "quarta", label: "Qua" },
  { value: "quinta", label: "Qui" },
  { value: "sexta", label: "Sex" },
  { value: "sabado", label: "Sáb" },
];

function Steps({ atual }: { atual: 1 | 2 | 3 }) {
  const labels = ["Studio", "Turma", "Aluna"];
  return (
    <div className="mb-8 flex items-center gap-2">
      {labels.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const isDone = step < atual;
        const isCurrent = step === atual;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                isDone
                  ? "bg-rose-600 text-white"
                  : isCurrent
                    ? "bg-rose-100 text-rose-700 ring-2 ring-rose-600"
                    : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {step}
            </div>
            <span
              className={`text-xs font-medium ${isCurrent ? "text-ink-900" : "text-ink-500"}`}
            >
              {label}
            </span>
            {step < 3 && <div className="h-px flex-1 bg-neutral-200" />}
          </div>
        );
      })}
    </div>
  );
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ etapa?: string; erro?: string }>;
}) {
  const { etapa, erro } = await searchParams;

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

  const step: "studio" | "turma" | "aluna" = !studio
    ? "studio"
    : etapa === "aluna"
      ? "aluna"
      : etapa === "turma"
        ? "turma"
        : "turma";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f1e0e5,transparent_45%),#faf9f7] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-6 shadow-[0_20px_60px_rgba(73,39,52,.12)] sm:p-8">
        <BrandLogo className="mb-1" />

        <Steps atual={step === "studio" ? 1 : step === "turma" ? 2 : 3} />

        {erro && (
          <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-danger">
            {erro}
          </p>
        )}

        {step === "studio" && (
          <>
            <h1 className="text-xl font-semibold text-ink-900">
              Vamos configurar seu studio
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Só o essencial para começar.
            </p>
            <form action={createStudio} className="mt-6 flex flex-col gap-4">
              <Input
                label="Nome do studio"
                name="nome"
                required
                placeholder="Studio Arabesque"
              />
              <Input
                label="Seu nome (responsável)"
                name="responsavel_nome"
                placeholder="Ana Souza"
              />
              <Input
                label="Telefone"
                name="telefone"
                placeholder="(11) 99999-9999"
              />
              <Input label="Cidade" name="cidade" placeholder="São Paulo" />
              <Button type="submit" className="mt-2 w-full">
                Continuar
              </Button>
            </form>
          </>
        )}

        {step === "turma" && studio && (
          <>
            <h1 className="text-xl font-semibold text-ink-900">
              Crie sua primeira turma
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Você pode criar quantas turmas quiser depois.
            </p>
            <form action={createFirstClass} className="mt-6 flex flex-col gap-4">
              <Input
                label="Nome da turma"
                name="nome"
                required
                placeholder="Ballet Infantil A"
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink-900">
                  Dias da semana
                </span>
                <div className="flex flex-wrap gap-2">
                  {DIAS.map((dia) => (
                    <label
                      key={dia.value}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm has-checked:border-rose-500 has-checked:bg-rose-50 has-checked:text-rose-700"
                    >
                      <input
                        type="checkbox"
                        name="dias_semana"
                        value={dia.value}
                        className="accent-rose-600"
                      />
                      {dia.label}
                    </label>
                  ))}
                </div>
              </div>
              <Input
                label="Horário"
                name="horario"
                placeholder="17:00"
              />
              <Button type="submit" className="mt-2 w-full">
                Continuar
              </Button>
            </form>
            <form action={skipOnboardingStep.bind(null, "aluna")} className="mt-2">
              <button
                type="submit"
                className="w-full py-2 text-center text-sm font-medium text-ink-500 hover:text-rose-700"
              >
                Pular turma por enquanto
              </button>
            </form>
          </>
        )}

        {step === "aluna" && studio && (
          <>
            <h1 className="text-xl font-semibold text-ink-900">
              Cadastre sua primeira aluna
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Depois você importa o resto da turma com calma.
            </p>
            <form
              action={createFirstStudent}
              className="mt-6 flex flex-col gap-4"
            >
              <Input
                label="Nome da aluna"
                name="nome"
                required
                placeholder="Marina Souza"
              />
              <Input
                label="Nome do responsável"
                name="responsavel_nome"
                placeholder="Ana Souza"
              />
              <Input
                label="Telefone do responsável"
                name="telefone_responsavel"
                placeholder="(11) 99999-9999"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Mensalidade (R$)"
                  name="mensalidade_valor"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="150"
                />
                <Select label="Vencimento" name="dia_vencimento" defaultValue="10">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                    <option key={dia} value={dia}>
                      Dia {dia}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="submit" className="mt-2 w-full">
                Concluir e ver meu studio
              </Button>
            </form>
            <form action={skipOnboardingStep.bind(null, "concluir")} className="mt-2">
              <button
                type="submit"
                className="w-full text-center text-sm text-ink-500 hover:text-ink-700"
              >
                Pular por enquanto
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
