import {
  computed,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
} from '@angular/fire/firestore';
import { map, Observable, shareReplay } from 'rxjs';

import { accumulate, partition } from '@/shared/helpers';
import {
  CreateTransaction,
  Transaction,
  TransactionStats,
} from '@/shared/interfaces';
import { FirestoreHelperService } from '@/shared/services';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly firestoreHelperService = inject(FirestoreHelperService);
  private readonly injector = inject(EnvironmentInjector);

  private readonly _transactions = signal<Transaction[] | undefined>(undefined);
  private _lastSnapshot = signal<QueryDocumentSnapshot | null>(null);
  private _isLoading = signal(false);
  private _stats$: Observable<TransactionStats>;

  public create(payload: CreateTransaction) {
    const data = { ...payload, createdAt: Timestamp.now() } as Transaction;

    return runInInjectionContext(this.injector, () =>
      addDoc(
        this.firestoreHelperService.getCollection('transactions'),
        data,
      ).then((ref) => {
        data.uid = ref.id;
        this._transactions.update((prev) => {
          if (!prev) {
            return [];
          }
          return [data, ...prev];
        });
      }),
    );
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

      const data = await runInInjectionContext(this.injector, () =>
        getDocs(
          query(
            this.firestoreHelperService.getCollection('transactions'),
            ...q,
          ),
        ),
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

  public deleteById(uid: string): Promise<void> {
    return runInInjectionContext(this.injector, () =>
      deleteDoc(
        doc(this.firestoreHelperService.getCollection('transactions'), uid),
      ).then(() => {
        this._transactions.update((prev) => {
          if (!prev) {
            return [];
          }
          const clone = prev.slice();
          const foundIdx = clone.findIndex((it) => it.uid === uid);
          if (foundIdx > -1) {
            clone.splice(foundIdx, 1);
          }
          return clone;
        });
      }),
    );
  }

  public getStats(): Observable<TransactionStats> {
    if (this._stats$) {
      return this._stats$;
    }
    return (this._stats$ = runInInjectionContext(this.injector, () =>
      collectionData(
        query(this.firestoreHelperService.getCollection('transactions')),
      ).pipe(
        shareReplay(1),
        map((data) => {
          const [incomes, expenses] = partition(
            data,
            (it) => it['type'] === 'income',
          );
          return {
            totalIncome: accumulate(incomes, (it) => it['amount']),
            totalExpense: accumulate(expenses, (it) => it['amount']),
          };
        }),
      ),
    ));
  }
}
