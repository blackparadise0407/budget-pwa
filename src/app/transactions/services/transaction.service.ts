import { computed, inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
} from '@angular/fire/firestore';

import { CreateTransaction, Transaction } from '@/shared/interfaces';
import { FirestoreHelperService } from '@/shared/services';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly firestoreHelperService = inject(FirestoreHelperService);

  private readonly _transactions = signal<Transaction[] | undefined>(undefined);
  private _lastSnapshot = signal<QueryDocumentSnapshot | null>(null);
  private _isLoading = signal(false);

  public create(payload: CreateTransaction) {
    return addDoc(this.firestoreHelperService.userCollection('transactions'), {
      ...payload,
      createdAt: Timestamp.now(),
    });
  }

  public getAll() {
    return this._transactions.asReadonly();
  }

  public getCanLoadMore() {
    return computed(() => !!this._lastSnapshot());
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

      const q: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(5)];
      if (this._lastSnapshot()) {
        q.push(startAfter(this._lastSnapshot()));
      }
      const data = await getDocs(
        query(this.firestoreHelperService.userCollection('transactions'), ...q),
      );
      const transactions: Transaction[] = [];
      if (!data.size) {
        this._lastSnapshot.set(null);
      }
      let i = 0;
      data.forEach((it) => {
        if (i === data.size - 1) {
          this._lastSnapshot.set(it);
        }
        transactions.push({ ...it.data(), uid: it.id } as Transaction);
        i++;
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
