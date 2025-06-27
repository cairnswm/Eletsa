import React, { createContext, useState, ReactNode } from 'react';
import { transactions as transactionsData } from '../data/transactions';
import { Transaction, TransactionContextType } from '../types/transaction.types';
import { isPastDate, getCurrentTimestamp } from '../utils/dateUtils';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsData);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${getCurrentTimestamp()}`,
      timestamp: getCurrentTimestamp()
    };
    setTransactions(prev => [...prev, newTransaction]);
    saveToLocalStorage('transactions', [...transactions, newTransaction]);
  };

  const loadTransactions = () => {
    const storedTransactions = loadFromLocalStorage('transactions');
    if (Array.isArray(storedTransactions)) {
      setTransactions(storedTransactions as Transaction[]);
    }
  };

  const isTransactionPastDate = (transaction: Transaction) => {
    return isPastDate(transaction.timestamp);
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      loadTransactions,
      isTransactionPastDate
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export { TransactionContext };