import { inject, Injectable, signal } from '@angular/core';
import { addDoc, getDocs, query, Timestamp } from '@angular/fire/firestore';

import { CreateTransaction, Transaction } from '@/shared/interfaces';
import { FirestoreHelperService } from '@/shared/services';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly firestoreHelperService = inject(FirestoreHelperService);
  private readonly _transactions = signal<Transaction[] | undefined>(undefined);

  private _isLoading = signal(false);

  public create(payload: CreateTransaction) {
    return addDoc(
      this.firestoreHelperService.collection((user) => [
        'users',
        user.uid,
        'transactions',
      ]),
      {
        ...payload,
        createdAt: Timestamp.now(),
      },
    );
  }

  public getAll() {
    return this._transactions.asReadonly();
  }

  public getIsLoading() {
    return this._isLoading.asReadonly();
  }

  public async load(): Promise<void> {
    if (this._isLoading()) {
      return;
    }
    try {
      this._isLoading.set(true);
      const data = await getDocs(
        query(
          this.firestoreHelperService.collection((user) => [
            'users',
            user.uid,
            'transactions',
          ]),
        ),
      );
      const transactions: Transaction[] = [];
      data.forEach((it) => {
        transactions.push({ ...it.data(), uid: it.id } as Transaction);
      });
      this._transactions.update((prev) => {
        if (!prev) {
          return transactions;
        }
        return [...prev, ...transactions];
      });
    } finally {
      this._isLoading.set(false);
    }
  }
}
