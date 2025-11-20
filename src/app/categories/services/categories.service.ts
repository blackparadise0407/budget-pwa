import { inject, Injectable } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Observable, shareReplay } from 'rxjs';

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
      this.firestoreHelperService.collection((user) => [
        'users',
        user.uid,
        'categories',
      ]),
      { idField: 'uid' },
    ) as Observable<Category[]>).pipe(shareReplay(1));
  }
}
