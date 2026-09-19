export function diasDeAtraso(vencimento: string, dataPagamento: string | null): number {
  if (!dataPagamento) return 0;
  const venc = new Date(vencimento + "T00:00:00");
  const pago = new Date(dataPagamento + "T00:00:00");
  const diffMs = pago.getTime() - venc.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}
