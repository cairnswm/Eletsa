import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserTransaction, TransactionContextType } from '../types/transaction';
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
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchAccounts = React.useCallback(async () => {
    if (!user || !token) {
      setAccounts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Set TX API configuration
      if (window.TX) {
        window.TX.setAppId('e671937d-54c9-11f0-9ec0-1a220d8ac2c9');
        window.TX.setUserId(user.id);
      }
      
      const accountsData = await transactionsApi.fetchUserAccounts();
      setAccounts(accountsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts';
      setError(errorMessage);
      console.error('Failed to fetch accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  const fetchTransactions = React.useCallback(async (accountId?: number, limit: number = 100) => {
    if (!user || !token) {
      setTransactions([]);
      return;
    }

    // If no accountId provided, use the first account
    let targetAccountId = accountId;
    if (!targetAccountId && accounts.length > 0) {
      targetAccountId = accounts[0].id;
    }

    if (!targetAccountId) {
      console.log('No account ID available for fetching transactions');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const transactionsData = await transactionsApi.fetchAccountLedger(targetAccountId, limit);
      setTransactions(transactionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token, accounts]);

  const refreshTransactions = async () => {
    await fetchAccounts();
    if (accounts.length > 0) {
      await fetchTransactions(accounts[0].id);
    }
  };

  // Fetch accounts when user changes
  useEffect(() => {
    if (user && token) {
      fetchAccounts();
    } else {
      setAccounts([]);
      setTransactions([]);
      setError(null);
    }
  }, [user?.id, token, fetchAccounts]);

  // Fetch transactions when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0) {
      fetchTransactions(accounts[0].id);
    }
  }, [accounts, fetchTransactions]);

  // Clear data when user logs out
  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setTransactions([]);
      setError(null);
    }
  }, [user]);

  const value: TransactionContextType = {
    accounts,
    transactions,
    loading,
    error,
    fetchAccounts,
    fetchTransactions,
    refreshTransactions,
    clearError,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export { TransactionContext };