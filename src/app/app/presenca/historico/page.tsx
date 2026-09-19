import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icons } from "@/components/ui/icons";
import { PresenceTabs } from "@/components/app/presence-tabs";

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "2026-09"
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return `${MONTHS_PT[month - 1]} de ${year}`;
}

interface ClassMonthSummary {
  classId: string;
  className: string;
  monthKey: string;
  aulasDadas: number;
  presente: number;
  faltou: number;
  justificada: number;
  total: number;
}

export default async function PresencaHistoricoPage() {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const [{ data: classes }, { data: attendance }] = await Promise.all([
    supabase.from("classes").select("id, nome").eq("studio_id", studio.id).order("nome"),
    supabase
      .from("attendance")
      .select("class_id, data, status")
      .eq("studio_id", studio.id)
      .order("data", { ascending: false })
      .limit(2000),
  ]);

  const classNameById = new Map((classes ?? []).map((c) => [c.id, c.nome]));

  // Agrupa por turma + mês
  const grouped = new Map<string, ClassMonthSummary & { datas: Set<string> }>();

  (attendance ?? []).forEach((record) => {
    const mKey = monthKey(record.data);
    const groupKey = `${record.class_id}__${mKey}`;
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        classId: record.class_id,
        className: classNameById.get(record.class_id) ?? "Turma removida",
        monthKey: mKey,
        aulasDadas: 0,
        presente: 0,
        faltou: 0,
        justificada: 0,
        total: 0,
        datas: new Set(),
      });
    }
    const entry = grouped.get(groupKey)!;
    entry.datas.add(record.data);
    entry.total += 1;
    if (record.status === "presente") entry.presente += 1;
    else if (record.status === "faltou") entry.faltou += 1;
    else if (record.status === "justificada") entry.justificada += 1;
  });

  const summaries = Array.from(grouped.values())
    .map((entry) => ({ ...entry, aulasDadas: entry.datas.size }))
    .sort((a, b) => (a.monthKey === b.monthKey ? a.className.localeCompare(b.className) : b.monthKey.localeCompare(a.monthKey)));

  const monthKeys = Array.from(new Set(summaries.map((s) => s.monthKey)));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header>
        <p className="text-sm font-medium text-rose-700">Rotina de aula</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Histórico de chamadas
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Quantas aulas cada turma teve e a frequência média, mês a mês.
        </p>
      </header>

      <PresenceTabs />

      {monthKeys.length === 0 ? (
        <EmptyState
          icon={<Icons.attendance className="h-5 w-5" />}
          title="Nenhuma chamada registrada ainda"
          description="Assim que você fizer a primeira chamada, o histórico mensal aparece aqui."
        />
      ) : (
        monthKeys.map((mKey) => {
          const monthSummaries = summaries.filter((s) => s.monthKey === mKey);
          return (
            <section key={mKey}>
              <h2 className="mb-3 text-sm font-semibold text-ink-900">
                {formatMonthLabel(mKey)}
              </h2>
              <Card className="p-0">
                <ul className="divide-y divide-neutral-100">
                  {monthSummaries.map((summary) => {
                    const frequenciaMedia =
                      summary.total > 0
                        ? Math.round((summary.presente / summary.total) * 100)
                        : 0;
                    return (
                      <li
                        key={`${summary.classId}-${summary.monthKey}`}
                        className="flex items-center justify-between gap-4 px-4 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-900">
                            {summary.className}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-500">
                            {summary.aulasDadas} aula{summary.aulasDadas === 1 ? "" : "s"} dada
                            {summary.aulasDadas === 1 ? "" : "s"}
                            {summary.faltou > 0 ? ` · ${summary.faltou} falta${summary.faltou > 1 ? "s" : ""}` : ""}
                            {summary.justificada > 0
                              ? ` · ${summary.justificada} justificada${summary.justificada > 1 ? "s" : ""}`
                              : ""}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className={`text-lg font-semibold ${
                              frequenciaMedia >= 85
                                ? "text-success"
                                : frequenciaMedia >= 70
                                  ? "text-warning"
                                  : "text-danger"
                            }`}
                          >
                            {frequenciaMedia}%
                          </p>
                          <p className="text-[10px] uppercase tracking-wide text-ink-500">
                            frequência
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </section>
          );
        })
      )}
    </div>
  );
}
