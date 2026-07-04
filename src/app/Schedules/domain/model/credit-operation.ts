import { Installment } from '../../../Simulator/domain/model/installment';
import { Currency } from '../../../Configuration/domain/model/currency';

/** Una operación de crédito ya calculada y guardada, lista para su seguimiento. */
export interface CreditOperation {
  id: number;
  clientId: number;
  clientName: string;
  carId: number;
  carLabel: string;
  currency: Currency;
  financedAmount: number;
  tea: number;
  periodicRate: number;
  installmentAmount: number;
  totalPeriods: number;
  gracePeriods: number;
  schedule: Installment[];
  van: number;
  tir: number;
  discountRate: number;
  createdAt: Date;
}
