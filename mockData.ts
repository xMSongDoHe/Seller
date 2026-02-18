
import { GameID, Category, IDStatus, Expense } from './types';

export const initialCategories: Category[] = [
  { id: '1', name: 'Cyborg', imageUrl: 'https://picsum.photos/seed/cyborg1/400/300' },
  { id: '2', name: 'Leopard', imageUrl: 'https://picsum.photos/seed/leopard/400/300' },
  { id: '3', name: 'Dragon', imageUrl: 'https://picsum.photos/seed/dragon/400/300' },
];

export const initialIDs: GameID[] = [
  {
    id: '1',
    category: 'Cyborg',
    name: 'katw63erct25:kl2pc97640l',
    details: 'V4 Full, 10M Bounty',
    profit: 450,
    status: IDStatus.SOLD,
    dateAdded: '2023-10-25'
  },
  {
    id: '2',
    category: 'Cyborg',
    name: 'bohf40taya40:5t6cs0mwp3qu',
    details: 'V3, Gamepassครบ',
    profit: 320,
    status: IDStatus.AVAILABLE,
    dateAdded: '2023-10-25'
  }
];

export const initialExpenses: Expense[] = [
  { id: '1', title: 'ค่าโฆษณา Facebook', amount: 500, date: '2023-10-25' },
  { id: '2', title: 'ค่าน้ำมัน', amount: 200, date: '2023-10-25' },
];
