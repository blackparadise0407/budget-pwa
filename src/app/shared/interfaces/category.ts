import { Timestamp } from '@angular/fire/firestore';

export interface Category {
  uid: string;
  name: string;
  createdAt: Timestamp;
}

export type CreateCategory = Omit<Category, 'uid' | 'createdAt'>;
