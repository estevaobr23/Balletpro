import { formatCurrency, formatDate, formatMonthName } from "@/lib/utils/format";
import type { PaymentStatus } from "@/lib/types/database";

export const BILLING_SLUGS = [
  { slug: "{aluna}", description: "Nome da aluna" },
  { slug: "{responsavel}", description: "Nome do responsável (primeiro nome)" },
  { slug: "{valor}", description: "Valor da mensalidade" },
  { slug: "{vencimento}", description: "Data de vencimento" },
  { slug: "{mes}", description: "Mês de referência" },
  { slug: "{status}", description: "\"pendente\" ou \"atrasada\"" },
  { slug: "{studio}", description: "Nome do seu studio" },
] as const;

export function renderBillingMessage(
  template: string,
  data: {
    alunaNome: string;
    responsavelNome: string | null;
    valor: number;
    vencimento: string;
    referenciaMes: string;
    status: PaymentStatus;
    studioNome: string;
  }
): string {
  const primeiroNomeResponsavel =
    data.responsavelNome?.split(" ")[0] ?? data.alunaNome.split(" ")[0];

  return template
    .replaceAll("{aluna}", data.alunaNome)
    .replaceAll("{responsavel}", primeiroNomeResponsavel)
    .replaceAll("{valor}", formatCurrency(data.valor))
    .replaceAll("{vencimento}", formatDate(data.vencimento))
    .replaceAll("{mes}", formatMonthName(data.referenciaMes))
    .replaceAll("{status}", data.status === "atrasado" ? "atrasada" : "pendente")
    .replaceAll("{studio}", data.studioNome);
}
