import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasMinLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

  if (hasMinLength && hasUppercase && hasNumber && hasSpecialChar) {
    return null;
  }

  return {
    passwordStrength: {
      hasMinLength,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
    },
  };
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const passwordRepeat = control.get('passwordRepeat')?.value;

  if (!password || !passwordRepeat) return null;
  return password === passwordRepeat ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register-password',
  imports: [ReactiveFormsModule],
  templateUrl: './register-password.html',
  styleUrl: './register-password.css',
})
export class RegisterPassword {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, passwordStrengthValidator]],
        passwordRepeat: ['', Validators.required],
      },
      { validators: passwordMatchValidator },
    );
  }

  continue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Dummy - wird später durch echten Keycloak Call ersetzt
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/register/mail']);
    }, 1500);
  }

  back() {
    this.router.navigate(['/register/username']);
  }
}
