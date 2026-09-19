import { formatDate } from "@/lib/utils/format";

export function renderAbsenceMessage(data: {
  alunaNome: string;
  responsavelNome: string | null;
  turmaNome: string;
  dataFalta: string;
}): string {
  const primeiroNome = data.responsavelNome?.split(" ")[0] ?? data.alunaNome.split(" ")[0];

  return `Olá, ${primeiroNome}! Tudo bem?

Notei que ${data.alunaNome} não pôde vir à aula de ${data.turmaNome} no dia ${formatDate(data.dataFalta)}. Está tudo bem? Qualquer coisa, estou à disposição.`;
}
