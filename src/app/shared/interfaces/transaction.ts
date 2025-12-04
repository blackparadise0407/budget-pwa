import { Timestamp } from '@angular/fire/firestore';

export const TransactionType = {
  income: 'income',
  expense: 'expense',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  uid: string;
  type: TransactionType;
  categoryId: string;
  description: string;
  amount: number;
  createdAt: Timestamp;
}

export type CreateTransaction = Omit<Transaction, 'uid' | 'createdAt'>;

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
}
