import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {

  constructor(private router: Router) { }

  reenviarEmail() {
    this.router.navigate(['/auth/forgot-password']);
  }

  voltarLogin() {
    this.router.navigate(['/auth/login']);
  }
}