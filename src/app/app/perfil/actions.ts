"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";

type Result = { success: boolean; message: string };

export async function updateStudioProfile(formData: FormData): Promise<Result> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const responsavel_nome = String(formData.get("responsavel_nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim();

  if (!nome) {
    return { success: false, message: "Informe o nome do studio." };
  }

  const { error } = await supabase
    .from("studios")
    .update({
      nome,
      responsavel_nome: responsavel_nome || null,
      telefone: telefone || null,
      cidade: cidade || null,
    })
    .eq("id", studio.id);

  if (error) {
    return { success: false, message: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/app/perfil");
  revalidatePath("/app/dashboard");
  return { success: true, message: "Dados do studio atualizados." };
}

const MAX_LOGO_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export async function uploadStudioLogo(formData: FormData): Promise<Result> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Selecione uma imagem para enviar." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, message: "Use uma imagem PNG, JPG, WEBP ou SVG." };
  }
  if (file.size > MAX_LOGO_BYTES) {
    return { success: false, message: "A imagem precisa ter até 3MB." };
  }

  const extension = file.name.split(".").pop() || "png";
  const path = `${studio.id}/logo.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("studio-logos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { success: false, message: "Não foi possível enviar a imagem. Tente novamente." };
  }

  const { data: publicUrlData } = supabase.storage
    .from("studio-logos")
    .getPublicUrl(path);

  const logo_url = `${publicUrlData.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("studios")
    .update({ logo_url })
    .eq("id", studio.id);

  if (updateError) {
    return { success: false, message: "Logo enviada, mas não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/app/perfil");
  revalidatePath("/app/dashboard");
  return { success: true, message: "Logo do ateliê atualizada." };
}

export async function removeStudioLogo(): Promise<Result> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const { error } = await supabase
    .from("studios")
    .update({ logo_url: null })
    .eq("id", studio.id);

  if (error) {
    return { success: false, message: "Não foi possível remover a logo." };
  }

  revalidatePath("/app/perfil");
  revalidatePath("/app/dashboard");
  return { success: true, message: "Logo removida." };
}

export async function updateBillingMessageTemplate(formData: FormData): Promise<Result> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const template = String(formData.get("mensagem_cobranca_template") ?? "").trim();

  if (!template) {
    return { success: false, message: "A mensagem não pode ficar vazia." };
  }

  const { error } = await supabase
    .from("studios")
    .update({ mensagem_cobranca_template: template })
    .eq("id", studio.id);

  if (error) {
    return { success: false, message: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/app/perfil");
  revalidatePath("/app/cobranca");
  revalidatePath("/app/mensalidades");
  return { success: true, message: "Modelo de mensagem atualizado." };
}

export async function toggleDailyDigest(receber: boolean): Promise<Result> {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const { error } = await supabase
    .from("studios")
    .update({ receber_resumo_diario: receber })
    .eq("id", studio.id);

  if (error) {
    return { success: false, message: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/app/perfil");
  return {
    success: true,
    message: receber ? "Você vai receber o resumo diário por e-mail." : "Resumo diário desativado.",
  };
}
