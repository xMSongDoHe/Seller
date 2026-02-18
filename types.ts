
export enum IDStatus {
  SOLD = 'SOLD',
  AVAILABLE = 'AVAILABLE'
}

export interface GameID {
  id: string;
  category: string;
  name: string;
  details: string;
  profit: number;
  status: IDStatus;
  dateAdded: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

export interface DailySummary {
  date: string;
  totalProfit: number;
  idsSold: number;
}
