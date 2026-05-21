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

function thmMailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  return value.endsWith('@mni.thm.de') ? null : { thmMail: true };
}

@Component({
  selector: 'app-register-mail',
  imports: [ReactiveFormsModule],
  templateUrl: './register-mail.html',
  styleUrl: './register-mail.css',
})
export class RegisterMail {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      mail: ['', [Validators.required, thmMailValidator]],
    });
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
      this.router.navigate(['/register/description']);
    }, 1500);
  }

  back() {
    this.router.navigate(['/register/password']);
  }
}
