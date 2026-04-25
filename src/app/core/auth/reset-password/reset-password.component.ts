import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  mostrarSenha: boolean = false;
  mostrarNovaSenha: boolean = false;

  constructor(private router: Router) { }

  alterarVisibilidadeSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alterarVisibilidadeNovaSenha() {
    this.mostrarNovaSenha = !this.mostrarNovaSenha;
  }

  senhaAlterada() {
    this.router.navigate(['/auth/password-changed']);
  }
}