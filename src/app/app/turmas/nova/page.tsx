import Link from "next/link";
import { createClass } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DiasSemanaPicker } from "@/components/app/dias-semana-picker";

export default async function NovaTurmaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <Link href="/app/turmas" className="text-sm text-ink-500 hover:text-ink-700">
          ← Turmas
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Nova turma</h1>
        <p className="mt-1 text-sm text-ink-500">Defina a rotina semanal da turma.</p>
      </div>

      <Card>
        {erro && (
          <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-danger">
            {erro}
          </p>
        )}

        <form action={createClass} className="flex flex-col gap-4">
          <Input
            label="Nome da turma"
            name="nome"
            required
            placeholder="Ballet Infantil A"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Modalidade"
              name="modalidade"
              defaultValue="Ballet"
              placeholder="Ballet"
            />
            <Input label="Nível" name="nivel" placeholder="Iniciante" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Professor(a)" name="professor" placeholder="Camila Lima" />
            <Input
              label="Faixa etária"
              name="faixa_etaria"
              placeholder="4 a 6 anos"
            />
          </div>
          <DiasSemanaPicker />
          <Input label="Horário" name="horario" placeholder="17:00" />
          <Button type="submit" className="mt-2 w-full">
            Criar turma
          </Button>
        </form>
      </Card>
    </div>
  );
}
