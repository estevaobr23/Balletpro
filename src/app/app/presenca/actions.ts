"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStudio } from "@/lib/supabase/get-studio";
import type { AttendanceStatus } from "@/lib/types/database";

type Result = { success: boolean; message: string };
const ALLOWED: AttendanceStatus[] = ["presente", "faltou", "justificada"];
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export async function setAttendance(classId: string, studentId: string, data: string, status: AttendanceStatus): Promise<Result> {
  if (!classId || !studentId || !validDate(data) || !ALLOWED.includes(status)) return { success: false, message: "Dados da chamada inválidos." };
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: student } = await supabase.from("students").select("id").eq("id", studentId).eq("class_id", classId).eq("studio_id", studio.id).eq("ativo", true).maybeSingle();
  if (!student) return { success: false, message: "Aluna não encontrada nesta turma." };
  const { error } = await supabase.from("attendance").upsert({ studio_id: studio.id, class_id: classId, student_id: studentId, data, status }, { onConflict: "class_id,student_id,data" });
  if (error) return { success: false, message: "Não foi possível salvar. Tente novamente." };
  revalidatePath("/app/dashboard");
  revalidatePath("/app/presenca");
  return { success: true, message: "Presença salva." };
}

export async function markAllPresent(classId: string, data: string): Promise<Result> {
  if (!classId || !validDate(data)) return { success: false, message: "Turma ou data inválida." };
  const studio = await getCurrentStudio();
  const supabase = await createClient();
  const { data: turma } = await supabase.from("classes").select("id").eq("id", classId).eq("studio_id", studio.id).eq("ativo", true).maybeSingle();
  if (!turma) return { success: false, message: "Turma não encontrada." };
  const { data: students, error: studentsError } = await supabase.from("students").select("id").eq("class_id", classId).eq("studio_id", studio.id).eq("ativo", true);
  if (studentsError || !students?.length) return { success: false, message: "Esta turma não possui alunas ativas." };
  const rows = students.map((student) => ({ studio_id: studio.id, class_id: classId, student_id: student.id, data, status: "presente" as const }));
  const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "class_id,student_id,data" });
  if (error) return { success: false, message: "Não foi possível marcar a turma." };
  revalidatePath("/app/dashboard");
  revalidatePath("/app/presenca");
  return { success: true, message: "Todas as alunas foram marcadas como presentes." };
}
