import { InitialCosts } from './initial-costs';
import { PeriodicCharges } from './periodic-charges';

export type InstallmentPeriodType = 'T' | 'P' | 'N'; // Total, Parcial, Normal (servicio)

/** Una fila del cronograma de pagos (método francés + cuotón "Compra Inteligente"). */
export interface Installment {
  number: number;
  dueDate: Date;
  periodType: InstallmentPeriodType;
  isGracePeriod: boolean; // true si periodType es 'T' o 'P'

  initialBalance: number;
  interest: number;
  amortization: number;
  desgravamenInsurance: number;
  installmentAmount: number; // interés + seg. desgrav. + amortización del periodo (0 en gracia total)
  finalBalance: number;

  // Cargos que se cobran en todos los periodos, incluida la fila del cuotón (N+1)
  riskInsurance: number;
  gps: number;
  postage: number;
  administrativeFee: number;

  // Cronograma paralelo de la Cuota Final / Cuotón (crece como bono cupón cero)
  finalInstallmentInitialBalance: number;
  finalInstallmentInterest: number;
  finalInstallmentAmortization: number; // > 0 solo en la última fila (N+1)
  finalInstallmentDesgravamenInsurance: number; // "SegDesCF" en el Excel
  finalInstallmentFinalBalance: number;

  /** Salida de caja total del periodo (para VAN/TIR): cuota + cargos + amort. del cuotón. */
  totalCashOutflow: number;
}

/** Datos de entrada para simular un crédito vehicular estilo "Compra Inteligente". */
export interface CreditSimulationInput {
  clientId: number;
  carId: number;
  currency: string;
  vehiclePrice: number;
  downPaymentPercent: number;
  rateType: import('./rate-type').RateType;
  annualRate: number;
  capitalization: import('./payment-frequency').PaymentFrequency;
  paymentFrequency: import('./payment-frequency').PaymentFrequency;
  termMonths: number;

  finalInstallmentPercent?: number;

  graceTotalMonths: number;
  gracePartialMonths: number;

  initialCosts: InitialCosts;
  periodicCharges: PeriodicCharges;

  desgravamenInsurancePercent: number;
  riskInsurancePercent: number;

  discountRate: number;
  startDate?: Date;
}

/** Resultado completo de la simulación. */
export interface CreditSimulationResult {
  downPaymentAmount: number;
  initialCostsTotal: number;
  loanAmount: number;
  finalInstallmentAmount: number;
  netFinancedBalance: number;

  periodicRate: number;
  tea: number;
  installmentAmount: number;
  totalPeriods: number;
  graceTotalPeriods: number;
  gracePartialPeriods: number;

  schedule: Installment[];
  van: number;
  tir: number;
  discountRate: number;
}
