import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {IamStore} from '../../../application/iam.store';
import {SignUpCommand} from '../../../domain/model/sign-up.command';
import {Role} from '../../../domain/model/role';
import {BaseForm} from '../../../../shared/presentation/component/base-form/base-form';

@Component({
  selector: 'app-sign-up-form',
  imports: [
    MatButton, MatCard, MatCardContent, MatCardHeader, MatCardTitle,
    MatError, MatFormField, MatInput, MatSelectModule, ReactiveFormsModule, RouterLink
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css'
})
export class SignUpForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);

  roles = Object.values(Role);

  form = new FormGroup({
    username: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    role: new FormControl<Role>(Role.Buyer, {nonNullable: true, validators: [Validators.required]})
  });

  performSignUp() {
    if (this.form.invalid) return;
    const signUpCommand = new SignUpCommand({
      username: this.form.value.username!,
      password: this.form.value.password!,
      role: this.form.value.role!
    });
    this.store.signUp(signUpCommand, this.router);
  }
}
