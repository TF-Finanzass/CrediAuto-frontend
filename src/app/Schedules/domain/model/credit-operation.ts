import {Installment} from '../../../Simulator/domain/model/installment';

/** Una operación de crédito ya calculada y guardada, lista para su seguimiento. */
export interface CreditOperation {
  id: number;
  clientId: number;
  clientName: string;
  carId: number;
  carLabel: string;
  financedAmount: number;
  tea: number;
  periodicRate: number;
  installmentAmount: number;
  totalPeriods: number;
  gracePeriods: number;
  schedule: Installment[];
  createdAt: Date;
}
