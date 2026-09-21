import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CAKTO_WEBHOOK_SECRET = Deno.env.get("CAKTO_WEBHOOK_SECRET")!;

// IDs das ofertas cadastradas no produto BalletPro na Cakto.
// Os links "-legado" são de ofertas antigas que ainda podem ter tráfego
// residual (favoritos, anúncios em cache); mantidos até serem desativados.
const OFFER_IDS_BASICO = ["3cwhu9v", "36yqnbm"];
const OFFER_IDS_COMPLETO = ["3dcqzeb", "366vvu9"];

function mapOfferToPlano(offerId: string | undefined): "basico" | "completo" | null {
  if (!offerId) return null;
  if (OFFER_IDS_BASICO.includes(offerId)) return "basico";
  if (OFFER_IDS_COMPLETO.includes(offerId)) return "completo";
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: {
    secret?: string;
    event?: string;
    data?: {
      id?: string;
      baseAmount?: number;
      customer?: { email?: string };
      offer?: { id?: string; name?: string };
    };
  };

  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (body.secret !== CAKTO_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Responder rápido (limite de 8s da Cakto) e só processar o que interessa.
  if (body.event !== "purchase_approved") {
    return new Response(JSON.stringify({ ignored: true, event: body.event }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = body.data;
  const email = data?.customer?.email?.trim().toLowerCase();
  const transactionId = data?.id;
  const plano = mapOfferToPlano(data?.offer?.id);
  const valor = data?.baseAmount ?? 0;

  if (!email || !transactionId) {
    return new Response(JSON.stringify({ error: "missing email or transaction id" }), {
      status: 200, // 200 para não gerar retentativa infinita de um payload inválido
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!plano) {
    // Oferta desconhecida: não registra, não libera nada, só sinaliza no retorno.
    return new Response(
      JSON.stringify({ warning: "oferta não mapeada", offerId: data?.offer?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { error } = await supabase
    .from("purchases")
    .upsert(
      {
        email,
        plano,
        transaction_id: transactionId,
        valor,
        status: "aprovado",
      },
      { onConflict: "transaction_id" }
    );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, plano }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
