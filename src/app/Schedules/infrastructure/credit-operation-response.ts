import { BaseResource } from '../../shared/infrastructure/base-response';

export interface InstallmentResource {
  id: number;
  number: number;
  dueDate: string;
  periodType: 'T' | 'P' | 'N';
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
  finalInstallmentFinalBalance: number;
  totalCashOutflow: number;
}

export interface InitialCostsResource {
  notarial: number;
  registration: number;
  appraisal: number;
  studyFee: number;
  activationFee: number;
}

export interface PeriodicChargesResource {
  gps: number;
  postage: number;
  administrativeFee: number;
}

export interface CreditOperationResource extends BaseResource {
  id: number;
  clientId: number;
  carId: number;
  clientName: string;
  carLabel: string;
  currency: string;

  loanAmount: number;
  finalInstallmentAmount: number;
  netFinancedBalance: number;

  tea: number;
  periodicRate: number;
  installmentAmount: number;
  totalPeriods: number;
  graceTotalPeriods: number;
  gracePartialPeriods: number;

  initialCosts: InitialCostsResource;
  periodicCharges: PeriodicChargesResource;
  desgravamenInsurancePercent: number;
  riskInsurancePercent: number;

  schedule: InstallmentResource[];
  van: number;
  tir: number;
  discountRate: number;
  created: string | null;
  updated: string | null;
}

export type CreditOperationsResponse = CreditOperationResource[];
