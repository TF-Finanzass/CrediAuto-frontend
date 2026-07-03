import {BaseResource} from '../../shared/infrastructure/base-response';

/**
 * Represents the API resource for a car in the infrastructure layer of the 'cars' bounded context.
 */
export interface CarResource extends BaseResource {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  detail: string;
  status: string;
}

/**
 * El backend devuelve un array plano de CarResource, no un objeto envuelto.
 */
export type CarsResponse = CarResource[];
