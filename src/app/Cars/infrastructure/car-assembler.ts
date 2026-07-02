import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Car, CarStatus} from '../domain/model/car.entity';
import {CarResource, CarsResponse} from './cars-response';

/**
 * Assembler for converting between Car entities, CarResource resources, and CarsResponse.
 */
export class CarAssembler implements BaseAssembler<Car, CarResource, CarsResponse> {
  toEntitiesFromResponse(response: CarsResponse): Car[] {
    return response.cars.map(resource => this.toEntityFromResource(resource as CarResource));
  }

  toEntityFromResource(resource: CarResource): Car {
    return new Car({
      id: resource.id,
      brand: resource.brand,
      model: resource.model,
      year: resource.year,
      price: resource.price,
      fuelType: resource.fuelType,
      transmission: resource.transmission,
      detail: resource.detail,
      status: resource.status as CarStatus
    });
  }

  toResourceFromEntity(entity: Car): CarResource {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      year: entity.year,
      price: entity.price,
      fuelType: entity.fuelType,
      transmission: entity.transmission,
      detail: entity.detail,
      status: entity.status
    } as CarResource;
  }
}
