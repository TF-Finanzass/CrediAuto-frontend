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

  /** % del precio pagado como cuota final/cuotón. Si es undefined, se calcula
   *  automáticamente según el plazo (defaultFinalInstallmentPercent). */
  finalInstallmentPercent?: number;

  /** Meses de gracia total (no se paga nada; el interés se capitaliza). */
  graceTotalMonths: number;
  /** Meses de gracia parcial (se paga solo interés + seg. desgravamen), justo después de la gracia total. */
  gracePartialMonths: number;

  initialCosts: InitialCosts;
  periodicCharges: PeriodicCharges;

  desgravamenInsurancePercent: number; // % mensual sobre saldo vigente
  riskInsurancePercent: number; // % anual sobre el precio del vehículo, prorrateado por cuota

  discountRate: number; // COK anual, en %
  startDate?: Date;
}

/** Resultado completo de la simulación. */
export interface CreditSimulationResult {
  downPaymentAmount: number;
  initialCostsTotal: number;
  loanAmount: number; // "Préstamo": PV - CI + costos iniciales
  finalInstallmentAmount: number; // "CF": el cuotón
  netFinancedBalance: number; // "Saldo": Préstamo - VP(CF)

  periodicRate: number;
  tea: number;
  installmentAmount: number; // cuota constante de la fase normal (post-gracia)
  totalPeriods: number; // N (cuotas regulares, sin contar la fila de pago del cuotón)
  graceTotalPeriods: number;
  gracePartialPeriods: number;

  schedule: Installment[]; // N+1 filas: 1..N regulares + N+1 pago del cuotón
  van: number;
  tir: number;
  discountRate: number;
}
