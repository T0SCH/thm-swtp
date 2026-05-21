import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-description',
  imports: [ReactiveFormsModule],
  templateUrl: './register-description.html',
  styleUrl: './register-description.css',
})
export class RegisterDescription {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  finalize() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Dummy - wird später durch echten Keycloak Call ersetzt
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/register/success']);
    }, 1500);
  }

  skip() {
    this.router.navigate(['/register/success']);
  }

  back() {
    this.router.navigate(['/register/mail']);
  }
}
