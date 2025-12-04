import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs';

import { CategoriesService } from './categories/services/categories.service';
import { AuthService } from './shared/services';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: `./app.component.html`,
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly categoriesService = inject(CategoriesService);

  public isLoading = this.authService.isLoading;

  public ngOnInit(): void {
    this.authService.init();
    this.categoriesService.getAll().pipe(take(1)).subscribe();
  }
}
