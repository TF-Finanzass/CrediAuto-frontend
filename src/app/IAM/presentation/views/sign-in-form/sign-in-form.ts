import {Component, inject, signal} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {IamStore} from '../../../application/iam.store';
import {SignInCommand} from '../../../domain/model/sign-in.command';
import {BaseForm} from '../../../../shared/presentation/component/base-form/base-form';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {Role} from '../../../domain/model/role';

@Component({
  selector: 'app-sign-in-form',
  imports: [
    MatCard, MatCardContent,
    MatFormField, MatLabel, MatError, MatButton, MatInput, ReactiveFormsModule, RouterLink,
    MatButtonToggleGroup, MatButtonToggle, MatIconModule
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css'
})
export class SignInForm extends BaseForm {
  protected readonly Role = Role;
  protected readonly selectedRole = signal<Role>(Role.Seller);

  private router = inject(Router);
  private store = inject(IamStore);

  form = new FormGroup({
    username: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  protected selectRole(role: Role | string) {
    if (role === Role.Seller || role === Role.Buyer) {
      this.selectedRole.set(role);
    }
  }

  protected get title(): string {
    return this.selectedRole() === Role.Seller ? 'Acceso vendedor' : 'Acceso comprador';
  }

  protected get description(): string {
    return this.selectedRole() === Role.Seller
      ? 'Gestiona ventas, clientes y operaciones desde un solo lugar.'
      : 'Consulta simulaciones, cuotas y seguimiento de tus solicitudes.';
  }

  protected get registerLabel(): string {
    return this.selectedRole() === Role.Seller ? 'Registrarse como vendedor' : 'Registrarse como comprador';
  }

  performSignIn() {
    if (this.form.invalid) return;
    const signInCommand = new SignInCommand({
      username: this.form.value.username!,
      password: this.form.value.password!
    });
    this.store.signIn(signInCommand, this.router);
  }
}
