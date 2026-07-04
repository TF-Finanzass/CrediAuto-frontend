import { Installment } from '../../../Simulator/domain/model/installment';
import { InitialCosts } from '../../../Simulator/domain/model/initial-costs';
import { PeriodicCharges } from '../../../Simulator/domain/model/periodic-charges';
import { Currency } from '../../../Configuration/domain/model/currency';

export interface CreditOperation {
  id: number;
  clientId: number;
  clientName: string;
  carId: number;
  carLabel: string;
  currency: Currency;

  loanAmount: number;
  finalInstallmentAmount: number;
  netFinancedBalance: number;

  tea: number;
  periodicRate: number;
  installmentAmount: number;
  totalPeriods: number;
  graceTotalPeriods: number;
  gracePartialPeriods: number;

  initialCosts: InitialCosts;
  periodicCharges: PeriodicCharges;
  desgravamenInsurancePercent: number;
  riskInsurancePercent: number;

  schedule: Installment[];
  van: number;
  tir: number;
  discountRate: number;
  createdAt: Date;
}
