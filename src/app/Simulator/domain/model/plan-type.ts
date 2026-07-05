export function defaultFinalInstallmentPercent(termMonths: number): number {
  return termMonths === 24 ? 50 : 40;
}
