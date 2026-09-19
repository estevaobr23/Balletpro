import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils/dates";

export const dynamic = "force-dynamic";

type Raw = { valor: number; vencimento: string; status: string; referencia_mes: string; data_pagamento: string | null; students: { nome: string; responsavel_nome: string | null; telefone_responsavel: string | null; class_id: string | null; classes: { nome: string } | null } | null };
function safe(value: unknown) { let text = String(value ?? ""); if (/^[=+\-@]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; }

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Não autorizado", { status: 401 });
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_id", user.id).maybeSingle();
  if (!studio) return new Response("Studio não encontrado", { status: 404 });
  const url = new URL(request.url);
  const month = /^\d{4}-\d{2}$/.test(url.searchParams.get("mes") ?? "") ? url.searchParams.get("mes")! : todayISO().slice(0, 7);
  const status = url.searchParams.get("status") ?? "";
  const classId = url.searchParams.get("turma") ?? "";
  const { data, error } = await supabase.from("payments").select("valor, vencimento, status, referencia_mes, data_pagamento, students(nome, responsavel_nome, telefone_responsavel, class_id, classes(nome))").eq("studio_id", studio.id).eq("referencia_mes", `${month}-01`).order("vencimento");
  if (error) return new Response("Não foi possível gerar a planilha", { status: 500 });
  const today = todayISO();
  const rows = ((data ?? []) as unknown as Raw[]).map((row) => ({ ...row, effectiveStatus: row.status === "pendente" && row.vencimento < today ? "atrasado" : row.status })).filter((row) => !classId || row.students?.class_id === classId).filter((row) => !status || row.effectiveStatus === status);
  const header = ["Aluna", "Turma", "Responsável", "Telefone", "Mês", "Valor", "Vencimento", "Status", "Data do pagamento"];
  const csv = [header, ...rows.map((row) => [row.students?.nome ?? "Aluna removida", row.students?.classes?.nome ?? "Sem turma", row.students?.responsavel_nome ?? "", row.students?.telefone_responsavel ?? "", month, Number(row.valor).toFixed(2).replace(".", ","), row.vencimento.split("-").reverse().join("/"), row.effectiveStatus, row.data_pagamento ? row.data_pagamento.split("-").reverse().join("/") : ""])].map((row) => row.map(safe).join(";")).join("\r\n");
  return new Response(`\uFEFF${csv}`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="balletpro-mensalidades-${month}.csv"`, "Cache-Control": "no-store" } });
}
