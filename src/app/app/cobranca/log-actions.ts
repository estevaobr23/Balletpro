"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";

export async function logBillingSent(studentId: string, paymentId: string | null) {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  await supabase.from("billing_log").insert({
    studio_id: studio.id,
    student_id: studentId,
    payment_id: paymentId,
  });

  revalidatePath("/app/cobranca");
  revalidatePath("/app/mensalidades");
  revalidatePath(`/app/alunas/${studentId}`);
}
