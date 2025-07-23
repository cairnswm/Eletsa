import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserTransaction, TransactionContextType } from '../types/transaction';
import { transactionsApi } from '../services/transactions';
import { useAuth } from './AuthContext';

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchTransactions = React.useCallback(async () => {
    if (!user || !token) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const transactionsData = await transactionsApi.fetchUserTransactions();
      setTransactions(transactionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  // Fetch transactions when user changes
  useEffect(() => {
    if (user && token) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setError(null);
    }
  }, [user?.id, token, fetchTransactions]);

  // Clear transactions when user logs out
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setError(null);
    }
  }, [user]);

  const value: TransactionContextType = {
    transactions,
    loading,
    error,
    fetchTransactions,
    refreshTransactions,
    clearError,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export { TransactionContext };