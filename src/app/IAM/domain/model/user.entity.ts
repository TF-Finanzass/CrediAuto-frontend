import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { Role } from './role';

export class User implements BaseEntity {
  set fullName(value: string) { this._fullName = value; }
  set email(value: string) { this._email = value; }
  set role(value: Role) { this._role = value; }
  set id(value: number) { this._id = value; }

  get fullName(): string { return this._fullName; }
  get email(): string { return this._email; }
  get role(): Role { return this._role; }
  get id(): number { return this._id; }

  private _id: number;
  private _fullName: string;
  private _email: string;
  private _role: Role;

  constructor(user: {id: number, fullName: string, email: string, role: Role}) {
    this._id = user.id;
    this._fullName = user.fullName;
    this._email = user.email;
    this._role = user.role;
  }
}
