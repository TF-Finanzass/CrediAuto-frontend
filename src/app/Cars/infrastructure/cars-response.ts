import { BaseResource } from '../../shared/infrastructure/base-response';

export interface CarResource extends BaseResource {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  detail: string;
  status: string;
}

export type CarsResponse = CarResource[];
