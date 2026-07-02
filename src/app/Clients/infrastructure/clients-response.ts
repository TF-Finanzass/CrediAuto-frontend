import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface ClientResource extends BaseResource {
  id: number;
  fullName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  status: string;
}

export interface ClientsResponse extends BaseResponse {
  clients: ClientResource[];
}
