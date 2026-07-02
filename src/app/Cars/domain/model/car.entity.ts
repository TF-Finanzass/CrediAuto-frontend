import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Estados posibles de un vehículo en el catálogo.
 */
export enum CarStatus {
  Disponible = 'Disponible',
  Reservado = 'Reservado',
  Agotado = 'Agotado'
}

/**
 * Represents a Car entity in the domain layer of the 'cars' bounded context.
 * @remarks
 * Used as domain model for vehicles available for sale on credit.
 * @see {@link BaseEntity}
 */
export class Car implements BaseEntity {
  constructor(car: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    fuelType: string;
    transmission: string;
    detail: string;
    status: CarStatus;
  }) {
    this._id = car.id;
    this._brand = car.brand;
    this._model = car.model;
    this._year = car.year;
    this._price = car.price;
    this._fuelType = car.fuelType;
    this._transmission = car.transmission;
    this._detail = car.detail;
    this._status = car.status;
  }

  private _id: number;
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  private _brand: string;
  get brand(): string { return this._brand; }
  set brand(value: string) { this._brand = value; }

  private _model: string;
  get model(): string { return this._model; }
  set model(value: string) { this._model = value; }

  private _year: number;
  get year(): number { return this._year; }
  set year(value: number) { this._year = value; }

  private _price: number;
  get price(): number { return this._price; }
  set price(value: number) { this._price = value; }

  private _fuelType: string;
  get fuelType(): string { return this._fuelType; }
  set fuelType(value: string) { this._fuelType = value; }

  private _transmission: string;
  get transmission(): string { return this._transmission; }
  set transmission(value: string) { this._transmission = value; }

  private _detail: string;
  get detail(): string { return this._detail; }
  set detail(value: string) { this._detail = value; }

  private _status: CarStatus;
  get status(): CarStatus { return this._status; }
  set status(value: CarStatus) { this._status = value; }
}
