export enum PaymentFrequency {
  Diaria = 'Diaria',
  Mensual = 'Mensual',
  Bimestral = 'Bimestral',
  Trimestral = 'Trimestral',
  Cuatrimestral = 'Cuatrimestral',
  Semestral = 'Semestral',
  Anual = 'Anual',
}

export function periodsPerYear(frequency: PaymentFrequency): number {
  const map: Record<PaymentFrequency, number> = {
    [PaymentFrequency.Diaria]: 360,
    [PaymentFrequency.Mensual]: 12,
    [PaymentFrequency.Bimestral]: 6,
    [PaymentFrequency.Trimestral]: 4,
    [PaymentFrequency.Cuatrimestral]: 3,
    [PaymentFrequency.Semestral]: 2,
    [PaymentFrequency.Anual]: 1,
  };
  return map[frequency];
}

export function monthsPerPeriod(frequency: PaymentFrequency): number {
  return 12 / periodsPerYear(frequency);
}
