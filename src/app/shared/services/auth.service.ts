import { computed, inject, Injectable, isDevMode, signal } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { signInWithPopup, signInWithRedirect, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthProvider, getAuth, getRedirectResult } from '@firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly firebaseApp = inject(FirebaseApp);
  private auth = getAuth(this.firebaseApp);

  private _isLoading = signal(true);
  private _user = signal<User | null>(null);

  public user = this._user.asReadonly();
  public isLoading = this._isLoading.asReadonly();
  public isAuthenticated = computed(() => !!this.user());

  constructor() {
    this.ensureInit().then(this.setUser.bind(this));
  }

  public ensureInit() {
    return new Promise<User | null>((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        resolve(user);
        document.getElementById('app-spinner')?.remove();
      });
    });
  }

  public async init(): Promise<void> {
    if (isDevMode()) {
      return;
    }
    try {
      const authResult = await getRedirectResult(this.auth);
      if (authResult?.user) {
        this.router.navigate(['/']);
      }
    } catch (error: unknown) {
      console.error('Error processing redirect result', error);
    }
  }

  public async signIn(provider: AuthProvider): Promise<void> {
    this._isLoading.set(true);
    if (isDevMode()) {
      const authResult = await signInWithPopup(this.auth, provider);
      this.setUser(authResult.user);
      this.router.navigate(['/']);
    } else {
      await signInWithRedirect(this.auth, provider);
    }
  }

  private setUser(user: User | null): void {
    this._user.set(user);
    this._isLoading.set(false);
  }
}
