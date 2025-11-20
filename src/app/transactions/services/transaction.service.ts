import { inject, Injectable } from '@angular/core';
import { addDoc, Firestore, Timestamp } from '@angular/fire/firestore';

import { CreateTransaction } from 'app/interfaces';
import { FirestoreHelperService } from 'app/services';

@Injectable()
export class TransactionService {
  private readonly firestore = inject(Firestore);
  private readonly firestoreHelperService = inject(FirestoreHelperService);

  public create(payload: CreateTransaction) {
    addDoc(
      this.firestoreHelperService.collection((user) => [
        'users',
        user.uid,
        'transactions',
      ]),
      {
        ...payload,
        createdAt: Timestamp.now(),
      }
    );
  }
}
