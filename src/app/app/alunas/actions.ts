"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import { onlyDigits } from "@/lib/utils/format";

function parseStudentForm(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? "").trim(),
    data_nascimento: String(formData.get("data_nascimento") ?? "").trim() || null,
    responsavel_nome: String(formData.get("responsavel_nome") ?? "").trim() || null,
    telefone_responsavel:
      onlyDigits(String(formData.get("telefone_responsavel") ?? "")) || null,
    class_id: String(formData.get("class_id") ?? "").trim() || null,
    modalidade: String(formData.get("modalidade") ?? "Ballet").trim() || "Ballet",
    mensalidade_valor: Number(formData.get("mensalidade_valor") ?? 0),
    dia_vencimento: Number(formData.get("dia_vencimento") ?? 10),
    observacoes: String(formData.get("observacoes") ?? "").trim() || null,
  };
}

export async function createStudent(formData: FormData) {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const fields = parseStudentForm(formData);

  if (!fields.nome) {
    redirect("/app/alunas/nova?erro=" + encodeURIComponent("Informe o nome da aluna."));
  }

  if (studio.limite_alunas !== null) {
    const { count } = await supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("studio_id", studio.id)
      .eq("ativo", true);

    if ((count ?? 0) >= studio.limite_alunas) {
      redirect(
        "/app/alunas/nova?erro=" +
          encodeURIComponent(
            `Seu plano permite até ${studio.limite_alunas} alunas ativas. Desative alguma aluna ou faça upgrade do plano para cadastrar mais.`
          )
      );
    }
  }

  const { error } = await supabase.from("students").insert({
    studio_id: studio.id,
    ...fields,
  });

  if (error) {
    redirect("/app/alunas/nova?erro=" + encodeURIComponent(error.message));
  }

  revalidatePath("/app/alunas");
  revalidatePath("/app/dashboard");
  redirect("/app/alunas");
}

export async function updateStudent(studentId: string, formData: FormData) {
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const fields = parseStudentForm(formData);

  if (!fields.nome) {
    redirect(`/app/alunas/${studentId}?erro=` + encodeURIComponent("Informe o nome da aluna."));
  }

  const { error } = await supabase
    .from("students")
    .update(fields)
    .eq("id", studentId)
    .eq("studio_id", studio.id);

  if (error) {
    redirect(`/app/alunas/${studentId}?erro=` + encodeURIComponent(error.message));
  }

  revalidatePath("/app/alunas");
  revalidatePath(`/app/alunas/${studentId}`);
  revalidatePath("/app/dashboard");
  redirect(`/app/alunas/${studentId}`);
}

export async function deactivateStudent(studentId: string) {
  const studio = await getCurrentStudio();
  const supabase = await createClient();

  await supabase
    .from("students")
    .update({ ativo: false })
    .eq("id", studentId)
    .eq("studio_id", studio.id);

  revalidatePath("/app/alunas");
  revalidatePath("/app/dashboard");
  redirect("/app/alunas");
}
