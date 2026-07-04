import { BaseResource } from '../../shared/infrastructure/base-response';

export interface InstallmentResource {
  id: number;
  number: number;
  dueDate: string;
  isGracePeriod: boolean;
  initialBalance: number;
  interest: number;
  amortization: number;
  insurance: number;
  installmentAmount: number;
  finalBalance: number;
}

export interface CreditOperationResource extends BaseResource {
  id: number;
  clientId: number;
  carId: number;
  clientName: string;
  carLabel: string;
  currency: string;
  financedAmount: number;
  tea: number;
  periodicRate: number;
  installmentAmount: number;
  totalPeriods: number;
  gracePeriods: number;
  schedule: InstallmentResource[];
  van: number;
  tir: number;
  discountRate: number;
  created: string | null;
  updated: string | null;
}

export type CreditOperationsResponse = CreditOperationResource[];
