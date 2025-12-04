import { Dialog } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Category } from '@/shared/interfaces';
import { DialogService } from '@/shared/services';
import { from, mergeMap, take } from 'rxjs';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-categories-config',
  imports: [AsyncPipe, RouterModule],
  templateUrl: './categories-config.component.html',
})
export class CategoriesConfigComponent {
  private readonly categoriesService = inject(CategoriesService);
  private readonly dialog = inject(Dialog);
  private readonly dialogService = inject(DialogService);

  public categories$ = this.categoriesService.getAll();

  public createCategory(): void {
    const ref = this.dialog.open(AddCategoryComponent);

    ref.componentInstance?.close.pipe(take(1)).subscribe(() => {
      ref.close();
    });

    ref.componentInstance?.create
      .pipe(
        take(1),
        mergeMap((payload) => this.categoriesService.create(payload)),
      )
      .subscribe(() => {
        ref.close();
      });
  }

  public deleteCategory(category: Category): void {
    const ref = this.dialogService.confirm({
      title: `Are you sure you want to delete “${category.name}”?`,
      description:
        "This action is permanent. You won't be able to recover this category, and all related transactions will also be deleted.",
      danger: true,
    });

    ref.componentInstance?.confirm
      .pipe(
        take(1),
        mergeMap(() => from(this.categoriesService.delete(category.uid))),
      )
      .subscribe(() => {
        ref.close();
      });
  }
}
