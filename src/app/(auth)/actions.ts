"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();

  if (!email || !password || password.length < 6) {
    redirect(
      "/cadastro?erro=" +
        encodeURIComponent("Preencha e-mail e uma senha com pelo menos 6 caracteres.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome },
    },
  });

  if (error) {
    redirect("/cadastro?erro=" + encodeURIComponent(error.message));
  }

  redirect("/app/onboarding");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?erro=" + encodeURIComponent("E-mail ou senha inválidos."));
  }

  redirect("/app/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
