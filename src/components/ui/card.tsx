export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}
export function StatCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "warning" | "danger" }) {
  const toneClass = { default: "text-ink-900", success: "text-success", warning: "text-warning", danger: "text-danger" }[tone];
  return <Card className="min-h-[104px] p-4 sm:p-5"><p className="text-xs font-medium uppercase tracking-[.08em] text-ink-500">{label}</p><p className={`mt-2 text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p></Card>;
}
