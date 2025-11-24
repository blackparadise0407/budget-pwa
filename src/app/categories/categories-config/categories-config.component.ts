import { Dialog } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { take } from 'rxjs';
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

  public categories$ = this.categoriesService.getCategories();

  public createCategory(): void {
    const ref = this.dialog.open(AddCategoryComponent);

    ref.componentInstance?.close.pipe(take(1)).subscribe(() => {
      ref.close();
    });
  }
}
