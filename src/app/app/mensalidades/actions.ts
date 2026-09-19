"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { todayISO } from "@/lib/utils/dates";

export type MutationResult = { success: boolean; message: string };

export async function gerarMensalidadesDoMes(referenciaMes: string): Promise<MutationResult> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: alunas, error: studentsError } = await supabase.from("students").select("id, mensalidade_valor, dia_vencimento").eq("studio_id", studio.id).eq("ativo", true);
  if (studentsError) return { success: false, message: "Não foi possível carregar as alunas." };
  if (!alunas?.length) return { success: false, message: "Cadastre uma aluna antes de gerar mensalidades." };
  const [year, month] = referenciaMes.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) return { success: false, message: "Mês inválido." };
  const rows = alunas.map((aluna) => ({ studio_id: studio.id, student_id: aluna.id, referencia_mes: `${year}-${String(month).padStart(2, "0")}-01`, valor: aluna.mensalidade_valor, vencimento: `${year}-${String(month).padStart(2, "0")}-${String(Math.min(aluna.dia_vencimento, 28)).padStart(2, "0")}`, status: "pendente" as const }));
  const { error } = await supabase.from("payments").upsert(rows, { onConflict: "student_id,referencia_mes", ignoreDuplicates: true });
  if (error) return { success: false, message: "Não foi possível gerar as mensalidades." };
  await marcarAtrasadas();
  revalidatePath("/app/dashboard");
  revalidatePath("/app/mensalidades");
  revalidatePath("/app/alunas");
  return { success: true, message: "Mensalidades do mês geradas." };
}

export async function marcarAtrasadas(): Promise<MutationResult> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { error } = await supabase.from("payments").update({ status: "atrasado" }).eq("studio_id", studio.id).eq("status", "pendente").lt("vencimento", todayISO());
  if (error) return { success: false, message: "Não foi possível atualizar os vencimentos." };
  revalidatePath("/app/dashboard");
  revalidatePath("/app/mensalidades");
  revalidatePath("/app/alunas");
  return { success: true, message: "Vencimentos atualizados." };
}

export async function markAsPaid(paymentId: string): Promise<MutationResult> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { error } = await supabase.from("payments").update({ status: "pago", data_pagamento: todayISO() }).eq("id", paymentId).eq("studio_id", studio.id);
  if (error) return { success: false, message: "Não foi possível confirmar o pagamento." };
  revalidatePath("/app/dashboard");
  revalidatePath("/app/mensalidades");
  revalidatePath("/app/alunas");
  return { success: true, message: "Pagamento confirmado." };
}

export async function undoPayment(paymentId: string): Promise<MutationResult> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: payment } = await supabase.from("payments").select("vencimento").eq("id", paymentId).eq("studio_id", studio.id).maybeSingle();
  if (!payment) return { success: false, message: "Mensalidade não encontrada." };
  const status = payment.vencimento < todayISO() ? "atrasado" : "pendente";
  const { error } = await supabase.from("payments").update({ status, data_pagamento: null }).eq("id", paymentId).eq("studio_id", studio.id);
  if (error) return { success: false, message: "Não foi possível desfazer o pagamento." };
  revalidatePath("/app/dashboard");
  revalidatePath("/app/mensalidades");
  revalidatePath("/app/alunas");
  return { success: true, message: "Pagamento desfeito." };
}
