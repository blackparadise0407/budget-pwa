import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter, skip, tap } from 'rxjs';

import { Transaction } from '@/shared/interfaces';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

@Component({
  selector: 'app-transaction-list',
  imports: [ScrollingModule, TransactionItemComponent],
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  @Output() loadMore = new EventEmitter();
  @Output() delete = new EventEmitter<string>();
  @Input({ required: true }) transactions: Transaction[];
  @Input({ required: true }) canLoadMore: boolean;
  @Input() isLoading = true;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  public trackById(_: number, item: Transaction): string {
    return item.uid;
  }

  public ngAfterViewInit(): void {
    this.viewPort.scrolledIndexChange
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skip(1),
        debounceTime(200),
        filter(
          () =>
            !this.isLoading &&
            this.canLoadMore &&
            this.viewPort.measureScrollOffset('bottom') < 50,
        ),
        tap(() => this.loadMore.emit()),
      )
      .subscribe();
  }

  public handleDelete(uid: string) {
    this.delete.emit(uid);
  }
}
