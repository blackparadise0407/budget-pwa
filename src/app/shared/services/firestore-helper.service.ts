import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  writeBatch,
  WriteBatch,
} from '@angular/fire/firestore';

import { AuthService } from './auth.service';

type Collection = 'transactions' | 'categories' | 'statistics';

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

  public getCollection(collection: Collection, ...segments: string[]) {
    return this.userCollection(collection, ...segments);
  }

  public createWriteBatch(): WriteBatch {
    return writeBatch(this.firestore);
  }

  /**
   * Should not expose to restrict collection
   */
  private collection(cb: (user: User) => string[]) {
    const [path, ...segments] = cb(this.getUser());
    return collection(this.firestore, path, ...segments);
  }

  private userCollection(...segments: string[]) {
    return this.collection((user) => ['users', user.uid, ...segments]);
  }
}
