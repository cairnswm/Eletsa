export interface UserTransaction {
  transaction_date: string;
  ticket_type_name: string;
  event_name: string;
  quantity: number;
  amount: string;
  payout_amount: number;
  cost_amount: number;
  balance: number;
  transaction_id: number;
  user_id: number;
  order_id: number;
  order_item_id: number;
  ticket_id: number;
  organizer_id: number;
}

export interface TransactionContextType {
  transactions: UserTransaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  clearError: () => void;
}