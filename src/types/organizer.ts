import { Event } from './event';

export interface Organizer {
  id: number;
  user_id: number;
  is_verified: boolean;
  verification_method: string | null;
  social_proof_links: string | null;
  payout_eligible: boolean;
  events_hosted: number;
  tickets_sold: number;
  positive_reviews: number;
  quick_payout_eligibility: boolean;
  badges: string | null;
  created_at: string;
  modified_at: string;
}

export interface PayoutRequest {
  id: number;
  amount: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  external_reference: string | null;
}

export interface Payout {
  id: number;
  organizer_id: number;
  payout_amount: number;
  payout_fee: number;
  payout_status: string;
  payout_request_date: string;
  payout_processed_date: string | null;
  payout_method: string | null;
  payout_reference: string | null;
  created_at: string;
  modified_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  organizer_id: number;
  related_ticket_id: number | null;
  related_payout_id: number | null;
  transaction_type: string;
  amount: number;
  currency: string;
  payment_provider: string;
  payment_reference: string;
  status: string;
  transaction_date: string;
  created_at: string;
  modified_at: string;
}

// Request types for creating/updating
export interface CreatePayoutRequestRequest {
  accountType: string;
  amount: number;
}

export interface UpdatePayoutRequestRequest {
  status?: string;
  payout_date?: string;
}

export interface CreatePayoutRequest {
  organizer_id: number;
  payout_amount: number;
  payout_fee: number;
  payout_status?: string;
  payout_request_date?: string;
  payout_processed_date?: string;
  payout_method?: string;
  payout_reference?: string;
}

export interface UpdatePayoutRequest {
  payout_status?: string;
  payout_processed_date?: string;
  payout_method?: string;
  payout_reference?: string;
}

export interface CreateTransactionRequest {
  user_id: number;
  organizer_id: number;
  related_ticket_id?: number;
  related_payout_id?: number;
  transaction_type: string;
  amount: number;
  currency: string;
  payment_provider: string;
  payment_reference: string;
  status?: string;
  transaction_date?: string;
}

export interface UpdateTransactionRequest {
  status?: string;
}

export interface OrganizerContextType {
  organizers: Organizer[];
  organizerEvents: Event[];
  payoutRequests: PayoutRequest[];
  payouts: Payout[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // Organizer methods
  fetchOrganizers: () => Promise<void>;
  fetchOrganizer: (id: number) => Promise<Organizer>;
  getOrganizer: (id: number) => Organizer | null;
  getOrganizerByUserId: (userId: number) => Organizer | null;
  createOrganizer: (data: CreateOrganizerRequest) => Promise<Organizer>;
  updateOrganizer: (id: number, data: UpdateOrganizerRequest) => Promise<Organizer>;
  
  // Organizer Events methods
  fetchOrganizerEvents: (organizerId: number) => Promise<Event[]>;
  getOrganizerEvents: (organizerId: number) => Event[];
  refreshOrganizerEvents: (organizerId: number) => Promise<Event[]>;
  
  // Payout Request methods
  fetchPayoutRequests: () => Promise<void>;
  fetchOrganizerPayoutRequests: (organizerId: number) => Promise<PayoutRequest[]>;
  createPayoutRequest: (data: CreatePayoutRequestRequest) => Promise<PayoutRequest>;
  updatePayoutRequest: (id: number, data: UpdatePayoutRequestRequest) => Promise<PayoutRequest>;
  
  // Payout methods
  fetchPayouts: () => Promise<void>;
  fetchOrganizerPayouts: (organizerId: number) => Promise<Payout[]>;
  createPayout: (data: CreatePayoutRequest) => Promise<Payout>;
  updatePayout: (id: number, data: UpdatePayoutRequest) => Promise<Payout>;
  
  // Transaction methods
  fetchTransactions: () => Promise<void>;
  fetchOrganizerTransactions: (organizerId: number) => Promise<Transaction[]>;
  createTransaction: (data: CreateTransactionRequest) => Promise<Transaction>;
  updateTransaction: (id: number, data: UpdateTransactionRequest) => Promise<Transaction>;
  
  // Utility methods
  clearError: () => void;
}