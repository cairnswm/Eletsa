import React, { createContext, useContext, useState, ReactNode } from 'react';
import { transactions as transactionsData } from '../data/transactions';

interface Transaction {
  id: string;
  organizerId: string;
  eventId: string;
  ticketId: string | null;
  type: 'sale' | 'payout' | 'refund' | 'adjustment';
  description: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  payoutDate: string | null;
  payoutMethod?: string;
  payoutReference?: string;
}

interface TransactionSummary {
  totalGrossRevenue: number;
  totalPlatformFees: number;
  totalNetRevenue: number;
  totalPayouts: number;
  pendingBalance: number;
  availableBalance: number;
  transactionCount: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  getOrganizerTransactions: (organizerId: string) => Transaction[];
  getEventTransactions: (eventId: string) => Transaction[];
  getTransactionSummary: (organizerId: string) => TransactionSummary;
  getMonthlyTransactions: (organizerId: string, year: number, month: number) => Transaction[];
  getPendingPayouts: (organizerId: string) => Transaction[];
  getCompletedPayouts: (organizerId: string) => Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  processPayouts: (organizerId: string, eventIds: string[]) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsData);

  const getOrganizerTransactions = (organizerId: string) => {
    return transactions.filter(transaction => transaction.organizerId === organizerId);
  };

  const getEventTransactions = (eventId: string) => {
    return transactions.filter(transaction => transaction.eventId === eventId);
  };

  const getTransactionSummary = (organizerId: string): TransactionSummary => {
    const organizerTransactions = getOrganizerTransactions(organizerId);
    
    const sales = organizerTransactions.filter(t => t.type === 'sale' && t.status === 'completed');
    const payouts = organizerTransactions.filter(t => t.type === 'payout' && t.status === 'completed');
    
    const totalGrossRevenue = sales.reduce((sum, t) => sum + t.grossAmount, 0);
    const totalPlatformFees = sales.reduce((sum, t) => sum + t.platformFee, 0);
    const totalNetRevenue = sales.reduce((sum, t) => sum + t.netAmount, 0);
    const totalPayouts = Math.abs(payouts.reduce((sum, t) => sum + t.netAmount, 0));
    
    const pendingBalance = totalNetRevenue - totalPayouts;
    const availableBalance = pendingBalance; // In a real system, this might be different based on payout schedules
    
    return {
      totalGrossRevenue,
      totalPlatformFees,
      totalNetRevenue,
      totalPayouts,
      pendingBalance,
      availableBalance,
      transactionCount: organizerTransactions.length
    };
  };

  const getMonthlyTransactions = (organizerId: string, year: number, month: number) => {
    const organizerTransactions = getOrganizerTransactions(organizerId);
    
    return organizerTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });
  };

  const getPendingPayouts = (organizerId: string) => {
    const organizerTransactions = getOrganizerTransactions(organizerId);
    
    // Get sales that haven't been paid out yet
    const sales = organizerTransactions.filter(t => 
      t.type === 'sale' && 
      t.status === 'completed' && 
      !t.payoutDate
    );
    
    return sales;
  };

  const getCompletedPayouts = (organizerId: string) => {
    const organizerTransactions = getOrganizerTransactions(organizerId);
    
    return organizerTransactions.filter(t => 
      t.type === 'payout' && 
      t.status === 'completed'
    );
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `txn-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
  };

  const processPayouts = (organizerId: string, eventIds: string[]) => {
    // Get pending sales for the specified events
    const pendingSales = transactions.filter(t => 
      t.organizerId === organizerId &&
      t.type === 'sale' &&
      t.status === 'completed' &&
      eventIds.includes(t.eventId) &&
      !t.payoutDate
    );
    
    if (pendingSales.length === 0) return;
    
    // Calculate total payout amount
    const totalPayout = pendingSales.reduce((sum, t) => sum + t.netAmount, 0);
    
    // Create payout transaction
    const payoutTransaction: Transaction = {
      id: `txn-payout-${Date.now()}`,
      organizerId,
      eventId: eventIds[0], // Use first event ID as primary reference
      ticketId: null,
      type: 'payout',
      description: `Payout for ${eventIds.length} event${eventIds.length > 1 ? 's' : ''}`,
      grossAmount: 0,
      platformFee: 0,
      netAmount: -totalPayout, // Negative because it's money going out
      status: 'completed',
      timestamp: new Date().toISOString(),
      payoutDate: new Date().toISOString(),
      payoutMethod: 'Bank Transfer',
      payoutReference: `PAY-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };
    
    // Update sales transactions with payout date
    const updatedTransactions = transactions.map(t => {
      if (pendingSales.some(ps => ps.id === t.id)) {
        return { ...t, payoutDate: payoutTransaction.payoutDate };
      }
      return t;
    });
    
    // Add payout transaction
    setTransactions([...updatedTransactions, payoutTransaction]);
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      getOrganizerTransactions,
      getEventTransactions,
      getTransactionSummary,
      getMonthlyTransactions,
      getPendingPayouts,
      getCompletedPayouts,
      addTransaction,
      processPayouts
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}