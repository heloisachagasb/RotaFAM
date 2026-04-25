import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  
  mostrarSenha: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {}

  returnUrl: string;
  
  carregando: boolean = false;

  ngOnInit(): void {
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/cadastros';
  }

  alterarVisibilidadeSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  esqueceuSenha() {
    this.router.navigate(['/auth/forgot-password']);
  }

  email: string = 'aluno@fam.br';
  senha: string = 'aluno123';

  submit() {
    if (this.email === 'aluno@fam.br' && this.senha === 'aluno123') {
        this.router.navigate(['/mapa']);
      return;
    }

    this.toastr.warning('Login/senha inválido!', 'Atenção!');
  }
}