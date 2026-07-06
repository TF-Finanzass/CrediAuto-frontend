import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IamStore } from '../../../application/iam.store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { Role } from '../../../domain/model/role';
import { BaseForm } from '../../../../shared/presentation/component/base-form/base-form';

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css',
})
export class SignUpForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);
  private snackBar = inject(MatSnackBar);

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  performSignUp() {
    if (this.form.invalid) return;
    const signUpCommand = new SignUpCommand({
      username: this.form.value.username!,
      password: this.form.value.password!,
      role: Role.Buyer,
    });
    this.store.signUp(
      signUpCommand,
      this.router,
      () => {
        this.snackBar.open('Cuenta creada exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      (message) => {
        this.snackBar.open(message, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    );
  }
}
