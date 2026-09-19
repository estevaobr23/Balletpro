"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { todayISO } from "@/lib/utils/dates";

type Result = { success: boolean; message: string };

export async function markPaymentAsPaidFromQueue(paymentId: string): Promise<Result> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const { error } = await supabase
    .from("payments")
    .update({ status: "pago", data_pagamento: todayISO() })
    .eq("id", paymentId)
    .eq("studio_id", studio.id);

  if (error) {
    return { success: false, message: "Não foi possível marcar como pago." };
  }

  revalidatePath("/app/cobranca");
  revalidatePath("/app/mensalidades");
  revalidatePath("/app/dashboard");
  return { success: true, message: "Marcado como pago." };
}
