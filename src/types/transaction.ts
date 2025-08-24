export interface UserAccount {
  id: number;
  account_type: string;
  balance: string;
}

export interface UserTransaction {
  id: number;
  transaction_id: number;
  user_id: number;
  account_type: string;
  type: string;
  gross_amount: string;
  currency: string;
  description: string;
  created_at: string;
  reference: string;
  transaction_description: string;
}

export interface TransactionContextType {
  accounts: UserAccount[];
  transactions: UserTransaction[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  fetchTransactions: (accountId?: number, limit?: number) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  clearError: () => void;
}