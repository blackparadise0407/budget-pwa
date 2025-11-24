import { inject, Injectable } from '@angular/core';
import { collectionData, doc, getDoc } from '@angular/fire/firestore';
import { from, mergeMap, Observable, of, shareReplay } from 'rxjs';

import { Category } from '@/shared/interfaces';
import { FirestoreHelperService } from '@/shared/services';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly firestoreHelperService = inject(FirestoreHelperService);
  private categories$: Observable<Category[]>;

  public getCategories() {
    if (this.categories$) {
      return this.categories$;
    }
    return (this.categories$ = collectionData(
      this.firestoreHelperService.userCollection('categories'),
      { idField: 'uid' },
    ) as Observable<Category[]>).pipe(shareReplay(1));
  }

  public getById(uid: Category['uid']) {
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

  private async getByIdFromExternalSource(
    uid: Category['uid'],
  ): Promise<Category> {
    const snapshot = await getDoc(
      doc(this.firestoreHelperService.userCollection('categories', uid)),
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
