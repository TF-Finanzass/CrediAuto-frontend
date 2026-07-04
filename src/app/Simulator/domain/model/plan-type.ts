/**
 * % de cuota final (cuotón) por defecto según el plazo, replicando la regla
 * del Excel "Compra Inteligente" estilo Interbank (24 meses -> 50%, resto -> 40%).
 * El usuario puede sobrescribirlo en el formulario.
 */
export function defaultFinalInstallmentPercent(termMonths: number): number {
  return termMonths === 24 ? 50 : 40;
}
