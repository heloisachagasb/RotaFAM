import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  constructor(private router: Router) {}

  voltarLogin() {
    this.router.navigate(['/auth/login']);
  }

  enviarEmail() {
    this.router.navigate(['/auth/verify-email']);
  }
}