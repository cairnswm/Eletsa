export interface Transaction {
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
  balance?: number;
}

export interface TransactionSummary {
  totalGrossRevenue: number;
  totalPlatformFees: number;
  totalNetRevenue: number;
  totalPayouts: number;
  pendingBalance: number;
  availableBalance: number;
  transactionCount: number;
}

export interface TransactionContextType {
  transactions: Transaction[];
  getOrganizerTransactions: (organizerId: string) => Transaction[];
  getOrganizerTransactionsWithBalance: (organizerId: string) => Transaction[];
  getEventTransactions: (eventId: string) => Transaction[];
  getTransactionSummary: (organizerId: string) => TransactionSummary;
  getMonthlyTransactions: (organizerId: string, year: number, month: number) => Transaction[];
  getPendingPayouts: (organizerId: string) => Transaction[];
  getCompletedPayouts: (organizerId: string) => Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  processPayouts: (organizerId: string, eventIds: string[]) => void;
  loadTransactions: () => void;
}
