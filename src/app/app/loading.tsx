export default function Loading() {
  return <div className="animate-pulse space-y-6" aria-label="Carregando"><div className="h-8 w-64 rounded-lg bg-neutral-200"/><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-white"/>)}</div><div className="h-64 rounded-xl bg-white"/></div>;
}
