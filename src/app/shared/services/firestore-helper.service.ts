import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { collection, Firestore } from '@angular/fire/firestore';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FirestoreHelperService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  private getUser(): User {
    const user = this.authService.user();
    if (!user) {
      throw new Error('Unauthenticated');
    }
    return user;
  }

  public collection(cb: (user: User) => string[]) {
    const [path, ...segments] = cb(this.getUser());
    return collection(this.firestore, path, ...segments);
  }
}
