import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddTransactionButtonComponent } from '@/transactions/add-transaction-button/add-transaction-button.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-core-layout',
  templateUrl: 'core-layout.component.html',
  imports: [
    RouterModule,
    HeaderComponent,
    AddTransactionButtonComponent,
    SidebarComponent,
  ],
})
export class CoreLayoutComponent {}
