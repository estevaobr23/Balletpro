"use client";

import Link from "next/link";
import { useState } from "react";
import { markAllPresent, setAttendance } from "@/app/app/presenca/actions";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import type { AttendanceStatus } from "@/lib/types/database";

interface StudentRow { id: string; nome: string; }
const OPTIONS: { value: AttendanceStatus; label: string; short: string; style: string }[] = [
  { value: "presente", label: "Presente", short: "P", style: "border-green-200 bg-green-50 text-success" },
  { value: "faltou", label: "Faltou", short: "F", style: "border-red-200 bg-red-50 text-danger" },
  { value: "justificada", label: "Justificada", short: "J", style: "border-amber-200 bg-amber-50 text-warning" },
];

export function AttendanceList({ classId, className, data, students, initialStatus }: { classId: string; className: string; data: string; students: StudentRow[]; initialStatus: Record<string, AttendanceStatus> }) {
  const [statusMap, setStatusMap] = useState(initialStatus);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);
  const [finished, setFinished] = useState(false);
  const toast = useToast();
  const marked = students.filter((student) => Boolean(statusMap[student.id])).length;
  const complete = students.length > 0 && marked === students.length;
  const progress = students.length ? Math.round((marked / students.length) * 100) : 0;

  async function choose(studentId: string, status: AttendanceStatus) {
    const previous = statusMap[studentId];
    setStatusMap((current) => ({ ...current, [studentId]: status }));
    setSaving((current) => new Set(current).add(studentId));
    setErrors((current) => { const next = new Set(current); next.delete(studentId); return next; });
    const result = await setAttendance(classId, studentId, data, status);
    setSaving((current) => { const next = new Set(current); next.delete(studentId); return next; });
    if (!result.success) { setStatusMap((current) => { const next = { ...current }; if (previous) next[studentId] = previous; else delete next[studentId]; return next; }); setErrors((current) => new Set(current).add(studentId)); toast(result.message, "error"); }
  }

  async function markEveryone() {
    setBulkSaving(true);
    const result = await markAllPresent(classId, data);
    setBulkSaving(false);
    if (result.success) setStatusMap(Object.fromEntries(students.map((student) => [student.id, "presente"] as const)));
    toast(result.message, result.success ? "success" : "error");
  }

  if (finished) return <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-success shadow-sm"><Icons.check className="h-7 w-7"/></span><h2 className="mt-4 text-xl font-semibold text-ink-900">Chamada concluída</h2><p className="mt-1 text-sm text-ink-500">{students.length} alunas registradas em {className}.</p><div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row"><Link href="/app/dashboard" className="rounded-xl bg-rose-700 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-800">Voltar ao início</Link><button type="button" onClick={() => setFinished(false)} className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold">Revisar chamada</button></div></div>;

  return <div className="space-y-4"><div className="sticky top-0 z-20 rounded-xl border border-neutral-200/90 bg-white/95 p-4 shadow-sm backdrop-blur"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-ink-900">{marked} de {students.length} marcadas</p><p className="text-xs text-ink-500">As alterações são salvas automaticamente.</p></div><Button type="button" variant="secondary" size="sm" disabled={bulkSaving} onClick={markEveryone}>{bulkSaving ? "Salvando…" : "Todas presentes"}</Button></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-rose-600 transition-all duration-300" style={{ width: `${progress}%` }}/></div></div>
    <ul className="space-y-2">{students.map((student) => <li key={student.id} className={`rounded-xl border bg-white p-4 shadow-sm transition ${errors.has(student.id) ? "border-red-300" : "border-neutral-200/90"}`}><div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-ink-900">{student.nome}</span><span className={`text-[11px] font-medium ${errors.has(student.id) ? "text-danger" : saving.has(student.id) ? "text-warning" : statusMap[student.id] ? "text-success" : "text-ink-500"}`}>{errors.has(student.id) ? "Erro · toque novamente" : saving.has(student.id) ? "Salvando…" : statusMap[student.id] ? "Salvo" : "Não marcada"}</span></div><div className="grid grid-cols-3 gap-2" role="group" aria-label={`Presença de ${student.nome}`}>{OPTIONS.map((option) => { const active = statusMap[student.id] === option.value; return <button key={option.value} type="button" aria-pressed={active} disabled={saving.has(student.id)} onClick={() => choose(student.id, option.value)} className={`min-h-11 rounded-lg border px-1 text-xs font-semibold transition active:scale-[.98] ${active ? `${option.style} ring-2 ring-current/10` : "border-neutral-200 bg-white text-ink-500 hover:bg-neutral-50"}`}><span className="sm:hidden">{option.short}</span><span className="hidden sm:inline">{option.label}</span></button>; })}</div></li>)}</ul>
    <Button type="button" size="lg" className="w-full" disabled={!complete} onClick={() => setFinished(true)}>{complete ? "Concluir chamada" : `Marque mais ${students.length - marked} aluna${students.length - marked === 1 ? "" : "s"}`}</Button>
  </div>;
}
