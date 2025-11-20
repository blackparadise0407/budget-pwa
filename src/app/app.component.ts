import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services';
import { HeaderComponent } from './layouts/header/header.component';
import { AddTransactionButtonComponent } from './transactions/add-transaction-button/add-transaction-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, AddTransactionButtonComponent],
  templateUrl: `./app.component.html`,
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);

  public isLoading = this.authService.isLoading;

  public ngOnInit(): void {
    this.authService.init();
  }
}
