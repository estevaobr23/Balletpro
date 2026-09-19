export function formatRelativeDays(isoDateTime: string): string {
  const then = new Date(isoDateTime);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "hoje";
  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `há ${weeks} semana${weeks > 1 ? "s" : ""}`;
  }
  const months = Math.floor(diffDays / 30);
  return `há ${months} ${months > 1 ? "meses" : "mês"}`;
}
