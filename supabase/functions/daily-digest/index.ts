import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("DIGEST_FROM_EMAIL") ?? "BalletPro <onboarding@resend.dev>";

const CRON_SECRET = Deno.env.get("CRON_SECRET");

interface StudentAttendanceSummary {
  studentId: string;
  nome: string;
  turmaNome: string;
  faltasRecentes: number;
  totalRecentes: number;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function startOfMonthISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error ${res.status}: ${text}`);
  }
}

function renderDigestEmail(params: {
  studioNome: string;
  previsto: number;
  recebido: number;
  atrasadasCount: number;
  atrasadasValor: number;
  faltososos: StudentAttendanceSummary[];
  appUrl: string;
}): string {
  const { studioNome, previsto, recebido, atrasadasCount, atrasadasValor, faltososos, appUrl } = params;

  const faltososRows = faltososos
    .map(
      (f) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${f.nome}</td><td style="padding:8px 0;border-bottom:1px solid #eee;color:#6b5b62;">${f.turmaNome}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#b3374a;font-weight:600;">${f.faltasRecentes}/${f.totalRecentes} faltas</td></tr>`
    )
    .join("");

  return `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2a1b22;">
    <p style="font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#7a1f3d;font-weight:600;margin:0 0 4px;">BalletPro</p>
    <h1 style="font-size:22px;margin:0 0 20px;">Resumo do ${studioNome}</h1>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr>
        <td style="padding:14px;background:#f7e9ee;border-radius:8px 0 0 8px;">
          <p style="margin:0;font-size:11px;color:#7a1f3d;text-transform:uppercase;">Previsto no mês</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;">${formatCurrency(previsto)}</p>
        </td>
        <td style="width:8px;"></td>
        <td style="padding:14px;background:#fdecec;border-radius:0 8px 8px 0;">
          <p style="margin:0;font-size:11px;color:#b3374a;text-transform:uppercase;">Atrasado</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#b3374a;">${formatCurrency(atrasadasValor)}</p>
        </td>
      </tr>
    </table>

    ${
      atrasadasCount > 0
        ? `<p style="font-size:15px;line-height:1.6;">Você tem <strong>${atrasadasCount} mensalidade${atrasadasCount > 1 ? "s" : ""} atrasada${atrasadasCount > 1 ? "s" : ""}</strong> este mês. Recebido até agora: ${formatCurrency(recebido)}.</p>
         <p style="margin:20px 0;"><a href="${appUrl}/app/cobranca" style="display:inline-block;background:#7a1f3d;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:14px;">Cobrar agora →</a></p>`
        : `<p style="font-size:15px;line-height:1.6;color:#4f7a5e;">Nenhuma mensalidade atrasada. Tudo em dia por aqui. ✓</p>`
    }

    ${
      faltososos.length > 0
        ? `<h2 style="font-size:16px;margin:28px 0 12px;">Alunas somem das aulas</h2>
           <table style="width:100%;border-collapse:collapse;font-size:14px;">
             <thead><tr><th style="text-align:left;padding-bottom:8px;color:#6b5b62;font-size:11px;text-transform:uppercase;">Aluna</th><th style="text-align:left;padding-bottom:8px;color:#6b5b62;font-size:11px;text-transform:uppercase;">Turma</th><th style="text-align:right;padding-bottom:8px;color:#6b5b62;font-size:11px;text-transform:uppercase;">Frequência</th></tr></thead>
             <tbody>${faltososRows}</tbody>
           </table>
           <p style="font-size:13px;color:#6b5b62;margin-top:8px;">Pode valer uma conversa com a família antes que a matrícula seja perdida.</p>`
        : ""
    }

    <p style="margin-top:32px;font-size:12px;color:#9a8a90;">Você recebe este resumo porque ativou os avisos diários no BalletPro. Pode desativar em Meu perfil, dentro do sistema.</p>
  </div>`;
}

Deno.serve(async (req: Request) => {
  if (CRON_SECRET) {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const appUrl = Deno.env.get("APP_URL") ?? "http://localhost:3000";
  const referenciaMes = startOfMonthISO();

  const { data: studios, error: studiosError } = await supabase
    .from("studios")
    .select("id, nome, owner_id, receber_resumo_diario")
    .eq("onboarding_completo", true)
    .eq("receber_resumo_diario", true);

  if (studiosError) {
    return new Response(JSON.stringify({ error: studiosError.message }), { status: 500 });
  }

  const results: Array<{ studioId: string; status: string }> = [];

  for (const studio of studios ?? []) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(studio.owner_id);
      const email = userData?.user?.email;
      if (!email) {
        results.push({ studioId: studio.id, status: "sem-email" });
        continue;
      }

      const { data: payments } = await supabase
        .from("payments")
        .select("valor, status")
        .eq("studio_id", studio.id)
        .eq("referencia_mes", referenciaMes);

      const previsto = (payments ?? []).reduce((sum, p) => sum + Number(p.valor), 0);
      const recebido = (payments ?? [])
        .filter((p) => p.status === "pago")
        .reduce((sum, p) => sum + Number(p.valor), 0);
      const atrasadas = (payments ?? []).filter((p) => p.status === "atrasado");
      const atrasadasValor = atrasadas.reduce((sum, p) => sum + Number(p.valor), 0);

      // Detecta faltas repetidas: alunas com 3+ faltas nas últimas 4 aulas registradas da turma
      const { data: students } = await supabase
        .from("students")
        .select("id, nome, class_id, classes(nome)")
        .eq("studio_id", studio.id)
        .eq("ativo", true)
        .not("class_id", "is", null);

      const faltososos: StudentAttendanceSummary[] = [];

      for (const student of students ?? []) {
        const { data: presencas } = await supabase
          .from("attendance")
          .select("status, data")
          .eq("student_id", student.id)
          .order("data", { ascending: false })
          .limit(4);

        if (!presencas || presencas.length < 3) continue;

        const faltas = presencas.filter((p) => p.status === "faltou").length;
        if (faltas >= 3) {
          const classes = student.classes as unknown as { nome: string } | null;
          faltososos.push({
            studentId: student.id,
            nome: student.nome,
            turmaNome: classes?.nome ?? "Sem turma",
            faltasRecentes: faltas,
            totalRecentes: presencas.length,
          });
        }
      }

      // Só envia se houver algo relevante para reportar
      if (atrasadas.length === 0 && faltososos.length === 0) {
        results.push({ studioId: studio.id, status: "nada-a-reportar" });
        continue;
      }

      const html = renderDigestEmail({
        studioNome: studio.nome,
        previsto,
        recebido,
        atrasadasCount: atrasadas.length,
        atrasadasValor,
        faltososos,
        appUrl,
      });

      const subject =
        atrasadas.length > 0
          ? `${atrasadas.length} mensalidade${atrasadas.length > 1 ? "s" : ""} atrasada${atrasadas.length > 1 ? "s" : ""} — ${studio.nome}`
          : `Alerta de frequência — ${studio.nome}`;

      await sendEmail(email, subject, html);
      results.push({ studioId: studio.id, status: "enviado" });
    } catch (err) {
      results.push({ studioId: studio.id, status: `erro: ${String(err)}` });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    headers: { "Content-Type": "application/json" },
  });
});
