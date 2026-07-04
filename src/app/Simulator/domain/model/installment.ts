/** Una fila del cronograma de pagos (método francés). */
export interface Installment {
  number: number;
  dueDate: Date;
  isGracePeriod: boolean;
  initialBalance: number;
  interest: number;
  amortization: number;
  insurance: number;
  installmentAmount: number; // cuota + seguro
  finalBalance: number;
}

/** Datos de entrada para simular un crédito vehicular. */
export interface CreditSimulationInput {
  clientId: number;
  carId: number;
  currency: string;
  vehiclePrice: number;
  downPaymentPercent: number;
  rateType: import('./rate-type').RateType;
  annualRate: number; // porcentaje, ej: 18 = 18%
  capitalization: import('./payment-frequency').PaymentFrequency; // solo si rateType = Nominal
  paymentFrequency: import('./payment-frequency').PaymentFrequency;
  termMonths: number;
  graceType: import('./grace-type').GraceType;
  graceMonths: number;
  monthlyInsurance: number;
  discountRate: number; // COK anual, en % (ej: 10 = 10%)
  startDate?: Date;
}

/** Resultado completo de la simulación. */
export interface CreditSimulationResult {
  downPaymentAmount: number;
  financedAmount: number;
  periodicRate: number; // tasa efectiva del periodo de pago (decimal)
  tea: number; // tasa efectiva anual usada (decimal)
  installmentAmount: number; // cuota constante (sin seguro) post-gracia
  totalPeriods: number;
  gracePeriods: number;
  schedule: Installment[];
  van: number; // Valor Actual Neto, desde el punto de vista del deudor
  tir: number; // TIR anualizada (decimal), comparable al TEA
  discountRate: number; // COK anual usado (decimal)
}
