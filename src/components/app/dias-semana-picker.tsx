const DIAS = [
  { value: "segunda", label: "Seg" },
  { value: "terca", label: "Ter" },
  { value: "quarta", label: "Qua" },
  { value: "quinta", label: "Qui" },
  { value: "sexta", label: "Sex" },
  { value: "sabado", label: "Sáb" },
  { value: "domingo", label: "Dom" },
];

export function DiasSemanaPicker({
  defaultValue = [],
}: {
  defaultValue?: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-900">Dias da semana</span>
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
              defaultChecked={defaultValue.includes(dia.value)}
              className="accent-rose-600"
            />
            {dia.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function formatDiasSemana(dias: string[]): string {
  const map: Record<string, string> = {
    segunda: "Seg",
    terca: "Ter",
    quarta: "Qua",
    quinta: "Qui",
    sexta: "Sex",
    sabado: "Sáb",
    domingo: "Dom",
  };
  if (dias.length === 0) return "Sem dias definidos";
  return dias.map((d) => map[d] ?? d).join(", ");
}
