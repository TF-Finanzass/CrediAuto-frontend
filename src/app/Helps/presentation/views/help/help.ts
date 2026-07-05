import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface FaqItem {
  key: string;
}

@Component({
  selector: 'app-help',
  imports: [TranslatePipe, MatIconModule, ReactiveFormsModule],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {
  faqItems: FaqItem[] = [{ key: 'q1' }, { key: 'q2' }, { key: 'q3' }, { key: 'q4' }, { key: 'q5' }];

  private openKeySignal = signal<string | null>(null);
  readonly openKey = this.openKeySignal.asReadonly();

  toggle(key: string): void {
    this.openKeySignal.set(this.openKey() === key ? null : key);
  }

  isOpen(key: string): boolean {
    return this.openKey() === key;
  }

  contactForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private submittedSignal = signal(false);
  readonly submitted = this.submittedSignal.asReadonly();

  isInvalidControl(controlName: 'name' | 'email' | 'message'): boolean {
    const control = this.contactForm.controls[controlName];
    return control.invalid && control.touched;
  }

  submitContactForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submittedSignal.set(true);
    this.contactForm.reset();
  }
}
