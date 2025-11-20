import { Component, inject } from '@angular/core';
import { AuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';

import { AuthService } from 'app/services';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  public email = '';
  public user = this.authService.user;

  public providers = [new GoogleAuthProvider()];

  public signInWithProvider(provider: AuthProvider): void {
    this.authService.signIn(provider);
  }
}
