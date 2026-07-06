import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IamStore } from '../../../application/iam.store';
import { SignInCommand } from '../../../domain/model/sign-in.command';
import { BaseForm } from '../../../../shared/presentation/component/base-form/base-form';

@Component({
  selector: 'app-sign-in-form',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css',
})
export class SignInForm extends BaseForm {
  private router = inject(Router);
  private store = inject(IamStore);

  errorMessage = signal<string | null>(null);

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  performSignIn() {
    if (this.form.invalid) return;
    this.errorMessage.set(null);
    const signInCommand = new SignInCommand({
      username: this.form.value.username!,
      password: this.form.value.password!,
    });
    this.store.signIn(signInCommand, this.router, (message) => this.errorMessage.set(message));
  }
}
