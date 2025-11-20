export const TransactionType = {
  income: 'income',
  expense: 'expense',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  uid: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  createdAt: number;
}

export type CreateTransaction = Omit<Transaction, 'uid' | 'createdAt'>;
