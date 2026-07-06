import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordStrengthRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export type PasswordStrengthLevel = 'muy-debil' | 'debil' | 'media' | 'fuerte' | 'muy-fuerte';

export function getPasswordRequirements(value: string): PasswordStrengthRequirements {
  const safeValue = value ?? '';
  return {
    minLength: safeValue.length >= 8,
    hasUpperCase: /[A-Z]/.test(safeValue),
    hasLowerCase: /[a-z]/.test(safeValue),
    hasNumber: /[0-9]/.test(safeValue),
    hasSpecialChar: /[^A-Za-z0-9]/.test(safeValue),
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const requirements = getPasswordRequirements(control.value);
    const isValid = Object.values(requirements).every(Boolean);
    return isValid ? null : { passwordStrength: requirements };
  };
}

export function calculatePasswordStrengthScore(value: string): number {
  const safeValue = value ?? '';
  if (!safeValue) return 0;

  let score = 0;
  if (safeValue.length >= 8) score++;
  if (safeValue.length >= 12) score++;
  if (/[A-Z]/.test(safeValue)) score++;
  if (/[a-z]/.test(safeValue)) score++;
  if (/[0-9]/.test(safeValue)) score++;
  if (/[^A-Za-z0-9]/.test(safeValue)) score++;

  return Math.min(score, 5);
}

export function passwordStrengthLevel(score: number): PasswordStrengthLevel {
  if (score <= 1) return 'muy-debil';
  if (score === 2) return 'debil';
  if (score === 3) return 'media';
  if (score === 4) return 'fuerte';
  return 'muy-fuerte';
}

export const PASSWORD_STRENGTH_LABELS: Record<PasswordStrengthLevel, string> = {
  'muy-debil': 'Muy débil',
  debil: 'Débil',
  media: 'Media',
  fuerte: 'Fuerte',
  'muy-fuerte': 'Muy fuerte',
};
