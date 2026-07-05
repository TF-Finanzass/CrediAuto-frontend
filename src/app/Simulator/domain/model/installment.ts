import { InitialCosts } from './initial-costs';
import { PeriodicCharges } from './periodic-charges';

export type InstallmentPeriodType = 'T' | 'P' | 'N'; // Total, Parcial, Normal (servicio)

export interface Installment {
  number: number;
  dueDate: Date;
  periodType: InstallmentPeriodType;
  isGracePeriod: boolean;
  initialBalance: number;
  interest: number;
  amortization: number;
  desgravamenInsurance: number;
  installmentAmount: number;
  finalBalance: number;
  riskInsurance: number;
  gps: number;
  postage: number;
  administrativeFee: number;
  finalInstallmentInitialBalance: number;
  finalInstallmentInterest: number;
  finalInstallmentAmortization: number;
  finalInstallmentDesgravamenInsurance: number;
  finalInstallmentFinalBalance: number;
  totalCashOutflow: number;
}

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
