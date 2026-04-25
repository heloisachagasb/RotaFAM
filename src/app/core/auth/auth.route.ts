import { Routes, RouterModule } from '@angular/router';
import { AuthAppComponent } from "./auth.app.component";
import { LoginComponent } from "./login/login.component";
import { NgModule } from "@angular/core";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordChangedComponent } from './password-changed/password-changed.component';

const routes: Routes = [
    {
      path: '',
      component: AuthAppComponent,
      children: [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full',
        },
        {
          path: 'login',
          component: LoginComponent,
          data: { returnUrl: window.location.pathname },
        }, 
        {
          path: 'forgot-password',
          component: ForgotPasswordComponent,
        },   
        {
          path: 'verify-email',
          component: VerifyEmailComponent,
        },       
        {
          path: 'reset-password',
          component: ResetPasswordComponent,
        },   
        {
          path: 'password-changed',
          component: PasswordChangedComponent,
        },       
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: '**', redirectTo: 'login', pathMatch: 'full' },
      ],
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class AuthRoutingModule {}
  