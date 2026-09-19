"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";

type Result = { success: boolean; message: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLeadEmail(formData: FormData): Promise<Result> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, message: "Informe um e-mail válido." };
  }

  const { error } = await supabase.from("leads").insert({
    studio_id: studio.id,
    email,
    origem: "novidades",
  });

  if (error) {
    return { success: false, message: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/app/novidades");
  return { success: true, message: "E-mail cadastrado! Vamos te avisar por lá também." };
}
