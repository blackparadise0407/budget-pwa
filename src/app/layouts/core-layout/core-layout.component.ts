import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddTransactionButtonComponent } from '@/transactions/add-transaction-button/add-transaction-button.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-core-layout',
  templateUrl: 'core-layout.component.html',
  imports: [RouterModule, AddTransactionButtonComponent, NavbarComponent],
})
export class CoreLayoutComponent {}
