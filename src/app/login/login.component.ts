import { Component, inject, signal } from '@angular/core';
import { AuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@/shared/services';

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

  public isLoading = signal(false);

  public signInWithProvider(provider: AuthProvider): void {
    this.isLoading.set(true);
    this.authService.signIn(provider);
  }
}
