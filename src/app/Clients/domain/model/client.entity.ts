import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export enum ClientStatus {
  Aprobado = 'Aprobado',
  Pendiente = 'Pendiente',
  Rechazado = 'Rechazado'
}

export class Client implements BaseEntity {
  constructor(client: {
    id: number;
    fullName: string;
    lastName: string;
    documentNumber: string;
    email: string;
    phone: string;
    monthlyIncome: number;
    status: ClientStatus;
  }) {
    this._id = client.id;
    this._fullName = client.fullName;
    this._lastName = client.lastName;
    this._documentNumber = client.documentNumber;
    this._email = client.email;
    this._phone = client.phone;
    this._monthlyIncome = client.monthlyIncome;
    this._status = client.status;
  }

  private _id: number;
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  private _fullName: string;
  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  private _lastName: string;
  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }

  private _documentNumber: string;
  get documentNumber(): string { return this._documentNumber; }
  set documentNumber(value: string) { this._documentNumber = value; }

  private _email: string;
  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  private _phone: string;
  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  private _monthlyIncome: number;
  get monthlyIncome(): number { return this._monthlyIncome; }
  set monthlyIncome(value: number) { this._monthlyIncome = value; }

  private _status: ClientStatus;
  get status(): ClientStatus { return this._status; }
  set status(value: ClientStatus) { this._status = value; }
}
