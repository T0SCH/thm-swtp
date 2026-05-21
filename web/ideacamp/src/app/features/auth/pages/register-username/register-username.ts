import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-username',
  imports: [ReactiveFormsModule],
  templateUrl: './register-username.html',
  styleUrl: './register-username.css',
})
export class RegisterUsername {
  form: FormGroup;
  isLoading = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
    });
  }

  continue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.serverError = '';

    // Dummy - wird später durch echten Keycloak Call ersetzt
    setTimeout(() => {
      this.isLoading = false;
      // Dummy Server-Fehler simulieren - später entfernen
      // this.serverError = 'Dieser Benutzername ist bereits vergeben';
      this.router.navigate(['/register/password']);
    }, 1500);
  }

  back() {
    this.router.navigate(['/login']);
  }
}
