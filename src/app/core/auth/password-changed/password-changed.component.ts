import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-changed',
  templateUrl: './password-changed.component.html',
  styleUrl: './password-changed.component.scss'
})
export class PasswordChangedComponent {
  
  constructor(private router: Router) {}

  voltarLogin() {
    this.router.navigate(['/auth/login']);
  }
}