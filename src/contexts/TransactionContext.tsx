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
  const [api, setApi] = useState<any>(null);

  const clearError = () => {
    setError(null);
  };

  // Load TX API
  useEffect(() => {
    console.log('TransactionContext: Loading TX API script...');
    const loadApi = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://tx.cairnsgames.co.za/tx.js';
        script.async = true;
        script.onload = () => {
          console.log('TransactionContext: TX script loaded successfully');
          if (window.TX) {
            console.log('TransactionContext: window.TX is available:', window.TX);
            setApi(window.TX);
          } else {
            console.error('TransactionContext: window.TX is not available after script load');
          }
        };
        script.onerror = () => {
          console.error('TransactionContext: Failed to load TX script');
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('Failed to load TX API:', error);
      }
    };

    loadApi();
  }, []);

  const fetchAccounts = React.useCallback(async () => {
    console.log('TransactionContext: fetchAccounts called', { user: user?.id, token: !!token, api: !!api });
    
    if (!user || !token || !api) {
      console.log('TransactionContext: Missing requirements for fetchAccounts', { 
        hasUser: !!user, 
        hasToken: !!token, 
        hasApi: !!api 
      });
      setAccounts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('TransactionContext: Setting TX API configuration', { appId: 'e671937d-54c9-11f0-9ec0-1a220d8ac2c9', userId: user.id });
      
      // Set TX API configuration
      if (api) {
        api.setAppId('e671937d-54c9-11f0-9ec0-1a220d8ac2c9');
        api.setUserId(user.id);
        console.log('TransactionContext: TX API configured successfully');
      }
      
      console.log('TransactionContext: Calling getUserBalances...');
      const accountsData = await transactionsApi.fetchUserAccounts();
      console.log('TransactionContext: Received accounts data:', accountsData);
      setAccounts(accountsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts';
      console.error('TransactionContext: Error fetching accounts:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, token, api]);

  const fetchTransactions = React.useCallback(async (accountId?: number, limit: number = 100) => {
    console.log('TransactionContext: fetchTransactions called', { 
      accountId, 
      limit, 
      user: user?.id, 
      token: !!token, 
      api: !!api,
      accountsLength: accounts.length 
    });
    
    if (!user || !token || !api) {
      console.log('TransactionContext: Missing requirements for fetchTransactions');
      setTransactions([]);
      return;
    }

    // If no accountId provided, use the first account
    let targetAccountId = accountId;
    if (!targetAccountId && accounts.length > 0) {
      targetAccountId = accounts[0].id;
      console.log('TransactionContext: Using first account ID:', targetAccountId);
    }

    if (!targetAccountId) {
      console.log('TransactionContext: No account ID available for fetching transactions');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('TransactionContext: Calling getAccountLedger with accountId:', targetAccountId, 'limit:', limit);
      const transactionsData = await transactionsApi.fetchAccountLedger(targetAccountId, limit);
      console.log('TransactionContext: Received transactions data:', transactionsData);
      setTransactions(transactionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      console.error('TransactionContext: Error fetching transactions:', err);
      setError(errorMessage);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token, api, accounts]);

  const refreshTransactions = async () => {
    if (accounts.length > 0) {
      await fetchTransactions(accounts[0].id);
    }
  };

  // Fetch accounts when user changes
  useEffect(() => {
    console.log('TransactionContext: User/token/api changed effect', { 
      user: user?.id, 
      token: !!token, 
      api: !!api 
    });
    
    if (user && token && api) {
      console.log('TransactionContext: All requirements met, calling fetchAccounts');
      fetchAccounts();
    } else {
      console.log('TransactionContext: Requirements not met, clearing data', user, token, api);
      setAccounts([]);
      setTransactions([]);
      setError(null);
    }
  }, [user?.id, token, api, fetchAccounts]);

  // Fetch transactions when accounts are loaded
  useEffect(() => {
    console.log('TransactionContext: Accounts changed effect', { accountsLength: accounts.length });
    
    if (accounts.length > 0) {
      console.log('TransactionContext: Accounts available, calling fetchTransactions');
      fetchTransactions(accounts[0].id);
    } else {
      console.log('TransactionContext: No accounts available');
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