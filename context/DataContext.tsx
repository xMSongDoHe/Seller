
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameID, Category, Expense, IDStatus } from '../types';
import { initialCategories, initialIDs, initialExpenses } from '../mockData';

interface DataContextType {
  categories: Category[];
  ids: GameID[];
  expenses: Expense[];
  addCategory: (name: string, imageUrl: string) => void;
  addID: (idData: Omit<GameID, 'id' | 'dateAdded'>) => void;
  addIDs: (idsData: Omit<GameID, 'id' | 'dateAdded'>[]) => void;
  deleteID: (id: string) => void;
  toggleIDStatus: (id: string) => void;
  bulkUpdateIDs: (idsToUpdate: string[], updates: Partial<GameID>) => void;
  addExpense: (title: string, amount: number) => void;
  deleteExpense: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('id_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [ids, setIds] = useState<GameID[]>(() => {
    const saved = localStorage.getItem('id_records');
    return saved ? JSON.parse(saved) : initialIDs;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('id_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  useEffect(() => {
    localStorage.setItem('id_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('id_records', JSON.stringify(ids));
  }, [ids]);

  useEffect(() => {
    localStorage.setItem('id_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addCategory = (name: string, imageUrl: string) => {
    const newCat: Category = { id: Date.now().toString(), name, imageUrl };
    setCategories([...categories, newCat]);
  };

  const addID = (idData: Omit<GameID, 'id' | 'dateAdded'>) => {
    const newID: GameID = {
      ...idData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setIds([...ids, newID]);
  };

  const addIDs = (idsData: Omit<GameID, 'id' | 'dateAdded'>[]) => {
    const now = Date.now();
    const dateStr = new Date().toISOString().split('T')[0];
    const newIDs: GameID[] = idsData.map((data, index) => ({
      ...data,
      id: (now + index).toString(),
      dateAdded: dateStr
    }));
    setIds([...ids, ...newIDs]);
  };

  const deleteID = (id: string) => {
    setIds(ids.filter(item => item.id !== id));
  };

  const toggleIDStatus = (id: string) => {
    setIds(ids.map(item => 
      item.id === id 
        ? { ...item, status: item.status === IDStatus.SOLD ? IDStatus.AVAILABLE : IDStatus.SOLD } 
        : item
    ));
  };

  const bulkUpdateIDs = (idsToUpdate: string[], updates: Partial<GameID>) => {
    setIds(ids.map(item => 
      idsToUpdate.includes(item.id) ? { ...item, ...updates } : item
    ));
  };

  const addExpense = (title: string, amount: number) => {
    const newExp: Expense = {
      id: Date.now().toString(),
      title,
      amount,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExp]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
      categories, ids, expenses, 
      addCategory, addID, addIDs, deleteID, toggleIDStatus, bulkUpdateIDs,
      addExpense, deleteExpense 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
