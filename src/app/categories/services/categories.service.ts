import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {
  addDoc,
  collectionData,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { from, mergeMap, Observable, of, shareReplay } from 'rxjs';

import { Category, CreateCategory } from '@/shared/interfaces';
import { FirestoreHelperService } from '@/shared/services';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly firestoreHelperService = inject(FirestoreHelperService);

  private _isLoading = signal(false);
  private categories$: Observable<Category[]>;

  public isLoading = this._isLoading.asReadonly();

  public getAll() {
    if (this.categories$) {
      return this.categories$;
    }
    return (this.categories$ = runInInjectionContext(
      this.injector,
      () =>
        collectionData(
          this.firestoreHelperService.getCollection('categories'),
          { idField: 'uid' },
        ) as Observable<Category[]>,
    )).pipe(shareReplay(1));
  }

  public getById(uid: string) {
    if (!this.categories$) {
      throw new Error('Categories not fully initialized yet');
    }
    return this.categories$.pipe(
      mergeMap((categories) => {
        const category = categories.find((it) => it.uid === uid);
        if (category) {
          return of(category);
        }
        return from(this.getByIdFromExternalSource(uid));
      }),
    );
  }

  public create(payload: CreateCategory) {
    this._isLoading.set(true);
    return runInInjectionContext(this.injector, () =>
      addDoc(this.firestoreHelperService.getCollection('categories'), {
        ...payload,
        createdAt: Timestamp.now(),
      }).finally(() => {
        this._isLoading.set(false);
      }),
    );
  }

  public delete(uid: string) {
    return runInInjectionContext(this.injector, async () => {
      const batch = this.firestoreHelperService.createWriteBatch();
      const transactions = await getDocs(
        query(
          this.firestoreHelperService.getCollection('transactions'),
          where('categoryId', '==', uid),
        ),
      );
      transactions.forEach((snapshot) => {
        batch.delete(
          doc(
            this.firestoreHelperService.getCollection('transactions'),
            snapshot.id,
          ),
        );
      });
      batch.delete(
        doc(this.firestoreHelperService.getCollection('categories'), uid),
      );
      return batch.commit().finally(() => {
        this._isLoading.set(false);
      });
    });
  }

  private async getByIdFromExternalSource(uid: string): Promise<Category> {
    const snapshot = await getDoc(
      doc(this.firestoreHelperService.getCollection('categories', uid)),
    );
    if (!snapshot.exists()) {
      throw new Error(`Category not found with ID ${uid}`);
    }
    return {
      uid: snapshot.id,
      ...snapshot.data(),
    } as Category;
  }
}
