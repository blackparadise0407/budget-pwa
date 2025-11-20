import { inject, Injectable, isDevMode, signal, Signal } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  Auth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  User,
} from '@angular/fire/auth';
import { AuthProvider, getAuth } from '@firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  private firebaseApp = inject(FirebaseApp);
  private auth: Auth = getAuth(this.firebaseApp);
  private _isLoading = signal(true);

  public user = this._user.asReadonly();
  public isLoading = this._isLoading.asReadonly();

  constructor() {
    this.auth.onAuthStateChanged(this.setUser.bind(this));
  }

  public async init(): Promise<void> {
    if (isDevMode()) {
      return;
    }
    try {
      const authResult = await getRedirectResult(this.auth);
      this.setUser(authResult?.user || null);
    } catch {
      this.setUser(null);
    }
  }

  public async signIn(provider: AuthProvider): Promise<void> {
    this._isLoading.set(true);
    if (isDevMode()) {
      const authResult = await signInWithPopup(this.auth, provider);
      this.setUser(authResult.user);
    } else {
      await signInWithRedirect(this.auth, provider);
    }
  }

  private setUser(user: User | null): void {
    this._user.set(user);
    this._isLoading.set(false);
  }
}
