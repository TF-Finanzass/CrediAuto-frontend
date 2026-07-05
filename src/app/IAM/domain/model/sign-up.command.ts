import { Role } from './role';

export class SignUpCommand {
  get username(): string { return this._username; }
  set username(value: string) { this._username = value; }

  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }

  get role(): Role { return this._role; }
  set role(value: Role) { this._role = value; }

  private _username: string;
  private _password: string;
  private _role: Role;

  constructor(resource: {username: string, password: string, role: Role}) {
    this._username = resource.username;
    this._password = resource.password;
    this._role = resource.role;
  }
}
