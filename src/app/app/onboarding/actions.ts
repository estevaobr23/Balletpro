"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createStudio(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nome = String(formData.get("nome") ?? "").trim();
  const responsavel_nome = String(formData.get("responsavel_nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim();

  if (!nome) {
    redirect("/app/onboarding?erro=" + encodeURIComponent("Informe o nome do studio."));
  }

  const { error } = await supabase.from("studios").insert({
    owner_id: user.id,
    nome,
    responsavel_nome: responsavel_nome || null,
    telefone: telefone || null,
    cidade: cidade || null,
  });

  if (error) {
    redirect("/app/onboarding?erro=" + encodeURIComponent(error.message));
  }

  redirect("/app/onboarding?etapa=turma");
}

export async function createFirstClass(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: studio } = await supabase
    .from("studios")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!studio) redirect("/app/onboarding");

  const nome = String(formData.get("nome") ?? "").trim();
  const horario = String(formData.get("horario") ?? "").trim();
  const dias = formData.getAll("dias_semana").map(String);

  if (!nome) {
    redirect("/app/onboarding?etapa=turma&erro=" + encodeURIComponent("Informe o nome da turma."));
  }

  const { error } = await supabase.from("classes").insert({
    studio_id: studio.id,
    nome,
    horario: horario || null,
    dias_semana: dias,
  });

  if (error) {
    redirect("/app/onboarding?etapa=turma&erro=" + encodeURIComponent(error.message));
  }

  redirect("/app/onboarding?etapa=aluna");
}

export async function createFirstStudent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: studio } = await supabase
    .from("studios")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!studio) redirect("/app/onboarding");

  const { data: firstClass } = await supabase
    .from("classes")
    .select("id")
    .eq("studio_id", studio.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const nome = String(formData.get("nome") ?? "").trim();
  const responsavel_nome = String(formData.get("responsavel_nome") ?? "").trim();
  const telefone_responsavel = String(formData.get("telefone_responsavel") ?? "").trim();
  const mensalidade_valor = Number(formData.get("mensalidade_valor") ?? 0);
  const dia_vencimento = Number(formData.get("dia_vencimento") ?? 10);

  if (!nome) {
    redirect("/app/onboarding?etapa=aluna&erro=" + encodeURIComponent("Informe o nome da aluna."));
  }

  const { error } = await supabase.from("students").insert({
    studio_id: studio.id,
    class_id: firstClass?.id ?? null,
    nome,
    responsavel_nome: responsavel_nome || null,
    telefone_responsavel: telefone_responsavel || null,
    mensalidade_valor,
    dia_vencimento,
  });

  if (error) {
    redirect("/app/onboarding?etapa=aluna&erro=" + encodeURIComponent(error.message));
  }

  await supabase
    .from("studios")
    .update({ onboarding_completo: true })
    .eq("id", studio.id);

  redirect("/app/dashboard");
}

export async function skipOnboardingStep(nextStep: "aluna" | "concluir") {
  if (nextStep === "concluir") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("studios")
        .update({ onboarding_completo: true })
        .eq("owner_id", user.id);
    }
    redirect("/app/dashboard");
  }
  redirect(`/app/onboarding?etapa=${nextStep}`);
}
