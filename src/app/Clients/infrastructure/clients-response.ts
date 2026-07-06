import { BaseResource } from '../../shared/infrastructure/base-response';

export interface ClientResource extends BaseResource {
  id: number;
  fullName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  userId: number;
  status: string;
}

export type ClientsResponse = ClientResource[];
