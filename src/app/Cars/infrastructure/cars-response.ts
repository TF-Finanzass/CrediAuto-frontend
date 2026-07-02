import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

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
 * Represents the API response structure for a list of cars.
 */
export interface CarsResponse extends BaseResponse {
  cars: CarResource[];
}
