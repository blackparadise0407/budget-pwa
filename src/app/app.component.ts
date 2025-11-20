import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from './shared/services';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: `./app.component.html`,
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);

  public isLoading = this.authService.isLoading;

  public ngOnInit(): void {
    this.authService.init();
  }
}
