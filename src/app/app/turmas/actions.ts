"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";

export async function createClass(formData: FormData) {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const modalidade = String(formData.get("modalidade") ?? "Ballet").trim();
  const professor = String(formData.get("professor") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "").trim();
  const faixa_etaria = String(formData.get("faixa_etaria") ?? "").trim();
  const horario = String(formData.get("horario") ?? "").trim();
  const dias_semana = formData.getAll("dias_semana").map(String);

  if (!nome) {
    redirect("/app/turmas/nova?erro=" + encodeURIComponent("Informe o nome da turma."));
  }

  const { error } = await supabase.from("classes").insert({
    studio_id: studio.id,
    nome,
    modalidade: modalidade || "Ballet",
    professor: professor || null,
    nivel: nivel || null,
    faixa_etaria: faixa_etaria || null,
    horario: horario || null,
    dias_semana,
  });

  if (error) {
    redirect("/app/turmas/nova?erro=" + encodeURIComponent(error.message));
  }

  revalidatePath("/app/turmas");
  revalidatePath("/app/dashboard");
  redirect("/app/turmas");
}

export async function updateClass(classId: string, formData: FormData) {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const modalidade = String(formData.get("modalidade") ?? "Ballet").trim();
  const professor = String(formData.get("professor") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "").trim();
  const faixa_etaria = String(formData.get("faixa_etaria") ?? "").trim();
  const horario = String(formData.get("horario") ?? "").trim();
  const dias_semana = formData.getAll("dias_semana").map(String);

  if (!nome) {
    redirect(`/app/turmas/${classId}?erro=` + encodeURIComponent("Informe o nome da turma."));
  }

  const { error } = await supabase
    .from("classes")
    .update({
      nome,
      modalidade: modalidade || "Ballet",
      professor: professor || null,
      nivel: nivel || null,
      faixa_etaria: faixa_etaria || null,
      horario: horario || null,
      dias_semana,
    })
    .eq("id", classId)
    .eq("studio_id", studio.id);

  if (error) {
    redirect(`/app/turmas/${classId}?erro=` + encodeURIComponent(error.message));
  }

  revalidatePath("/app/turmas");
  revalidatePath(`/app/turmas/${classId}`);
  revalidatePath("/app/dashboard");
  redirect("/app/turmas");
}

export async function deleteClass(classId: string) {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  await supabase
    .from("classes")
    .update({ ativo: false })
    .eq("id", classId)
    .eq("studio_id", studio.id);

  revalidatePath("/app/turmas");
  revalidatePath("/app/dashboard");
  redirect("/app/turmas");
}
