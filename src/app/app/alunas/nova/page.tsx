import Link from "next/link";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { createStudent } from "../actions";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function NovaAlunaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; turma?: string }>;
}) {
  const { erro, turma } = await searchParams;
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const { data: turmas } = await supabase
    .from("classes")
    .select("id, nome")
    .eq("studio_id", studio.id)
    .eq("ativo", true)
    .order("nome");

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <Link href="/app/alunas" className="text-sm text-ink-500 hover:text-ink-700">
          ← Alunas
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Nova aluna</h1>
        <p className="mt-1 text-sm text-ink-500">Cadastre só o essencial. Você pode completar depois.</p>
      </div>

      <Card>
        {erro && (
          <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-danger">
            {erro}
          </p>
        )}

        <form action={createStudent} className="flex flex-col gap-4">
          <Input label="Nome da aluna" name="nome" required placeholder="Marina Souza" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Turma" name="class_id" defaultValue={turma ?? ""}>
              <option value="">Sem turma</option>
              {(turmas ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </Select>
            <Input
              label="Data de nascimento"
              name="data_nascimento"
              type="date"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Mensalidade (R$)"
              name="mensalidade_valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="150"
            />
            <Select label="Dia de vencimento" name="dia_vencimento" defaultValue="10">
              {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                <option key={dia} value={dia}>
                  Dia {dia}
                </option>
              ))}
            </Select>
          </div>

          <Textarea
            label="Observações"
            name="observacoes"
            rows={3}
            placeholder="Alergias, restrições, particularidades..."
          />

          <Button type="submit" className="mt-2 w-full">
            Cadastrar aluna
          </Button>
        </form>
      </Card>
    </div>
  );
}
