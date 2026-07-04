import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { Currency } from '../../../Configuration/domain/model/currency';

export enum CarStatus {
  Disponible = 'Disponible',
  Reservado = 'Reservado',
  Agotado = 'Agotado',
}

export class Car implements BaseEntity {
  constructor(car: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    currency: Currency;
    detail: string;
    status: CarStatus;
  }) {
    this._id = car.id;
    this._brand = car.brand;
    this._model = car.model;
    this._year = car.year;
    this._price = car.price;
    this._currency = car.currency;
    this._detail = car.detail;
    this._status = car.status;
  }

  private _id: number;
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  private _brand: string;
  get brand(): string {
    return this._brand;
  }
  set brand(value: string) {
    this._brand = value;
  }

  private _model: string;
  get model(): string {
    return this._model;
  }
  set model(value: string) {
    this._model = value;
  }

  private _year: number;
  get year(): number {
    return this._year;
  }
  set year(value: number) {
    this._year = value;
  }

  private _price: number;
  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

  private _currency: Currency;
  get currency(): Currency {
    return this._currency;
  }
  set currency(value: Currency) {
    this._currency = value;
  }

  private _detail: string;
  get detail(): string {
    return this._detail;
  }
  set detail(value: string) {
    this._detail = value;
  }

  private _status: CarStatus;
  get status(): CarStatus {
    return this._status;
  }
  set status(value: CarStatus) {
    this._status = value;
  }
}
