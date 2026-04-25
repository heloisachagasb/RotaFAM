import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'auth-app-root',
  templateUrl: './auth.app.component.html',
})
export class AuthAppComponent {
  
  @HostBinding('class') classes = 'w-full h-full';
}