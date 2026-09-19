import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Studio } from "@/lib/types/database";

export async function getCurrentStudio(): Promise<Studio> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: studio } = await supabase
    .from("studios")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!studio) {
    redirect("/app/onboarding");
  }

  if (!studio.onboarding_completo) {
    redirect("/app/onboarding");
  }

  return studio;
}
