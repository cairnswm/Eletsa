import { createHeaders, handleApiResponse } from './api';
import {
  Organizer,
  PayoutRequest,
  Payout,
  Transaction,
  CreateOrganizerRequest,
  UpdateOrganizerRequest,
  CreatePayoutRequestRequest,
  UpdatePayoutRequestRequest,
  CreatePayoutRequest,
  UpdatePayoutRequest,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '../types/organizer';
import { Event } from '../types/event';

const ORGANIZER_API = 'https://eletsa.cairns.co.za/php/organizer';

export const organizersApi = {
  // Organizer endpoints
  async fetchOrganizers(): Promise<Organizer[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return Array.isArray(data) ? data : [data];
  },

  async fetchOrganizer(id: number): Promise<Organizer> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return data;
  },

  async createOrganizer(organizerData: CreateOrganizerRequest): Promise<Organizer> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(organizerData),
    });

    const data = await handleApiResponse(response);
    return Array.isArray(data) ? data[0] : data;
  },

  async updateOrganizer(id: number, organizerData: UpdateOrganizerRequest): Promise<Organizer> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(organizerData),
    });

    const data = await handleApiResponse(response);
    return data;
  },

  // Organizer subkey endpoints
  // FIXED: Use user ID instead of organizer ID since organizer_id field links to user table
  async fetchOrganizerEvents(userId: number): Promise<Event[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer/${userId}/events`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const events = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string coordinates to numbers and handle null values
    return events.map(event => ({
      ...event,
      location_latitude: event.location_latitude ? Number(event.location_latitude) : 0,
      location_longitude: event.location_longitude ? Number(event.location_longitude) : 0,
      popularity_score: event.popularity_score ? Number(event.popularity_score) : 0,
      max_attendees: event.max_attendees ? Number(event.max_attendees) : 0,
    }));
  },

  async fetchOrganizerPayoutRequests(organizerId: number): Promise<PayoutRequest[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer/${organizerId}/payout_requests`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const payoutRequests = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string amounts to numbers
    return payoutRequests.map(request => ({
      ...request,
      requested_amount: request.requested_amount ? Number(request.requested_amount) : 0,
    }));
  },

  async fetchOrganizerPayouts(organizerId: number): Promise<Payout[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer/${organizerId}/payouts`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const payouts = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string amounts to numbers
    return payouts.map(payout => ({
      ...payout,
      payout_amount: payout.payout_amount ? Number(payout.payout_amount) : 0,
      payout_fee: payout.payout_fee ? Number(payout.payout_fee) : 0,
    }));
  },

  async fetchOrganizerTransactions(organizerId: number): Promise<Transaction[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/organizer/${organizerId}/transactions`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const transactions = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string amounts to numbers
    return transactions.map(transaction => ({
      ...transaction,
      amount: transaction.amount ? Number(transaction.amount) : 0,
    }));
  },

  // Payout Request endpoints
  async fetchPayoutRequests(): Promise<PayoutRequest[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payout_requests`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const payoutRequests = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string amounts to numbers
    return payoutRequests.map(request => ({
      ...request,
      requested_amount: request.requested_amount ? Number(request.requested_amount) : 0,
    }));
  },

  async fetchPayoutRequest(id: number): Promise<PayoutRequest> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payout_requests/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string amounts to numbers
    return {
      ...data,
      requested_amount: data.requested_amount ? Number(data.requested_amount) : 0,
    };
  },

  async createPayoutRequest(payoutRequestData: CreatePayoutRequestRequest): Promise<PayoutRequest> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payout_requests`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(payoutRequestData),
    });

    const data = await handleApiResponse(response);
    const payoutRequest = Array.isArray(data) ? data[0] : data;
    
    // FIXED: Convert string amounts to numbers
    return {
      ...payoutRequest,
      requested_amount: payoutRequest.requested_amount ? Number(payoutRequest.requested_amount) : 0,
    };
  },

  async updatePayoutRequest(id: number, payoutRequestData: UpdatePayoutRequestRequest): Promise<PayoutRequest> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payout_requests/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(payoutRequestData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string amounts to numbers
    return {
      ...data,
      requested_amount: data.requested_amount ? Number(data.requested_amount) : 0,
    };
  },

  // Payout endpoints
  async fetchPayouts(): Promise<Payout[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payouts`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const payouts = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string amounts to numbers
    return payouts.map(payout => ({
      ...payout,
      payout_amount: payout.payout_amount ? Number(payout.payout_amount) : 0,
      payout_fee: payout.payout_fee ? Number(payout.payout_fee) : 0,
    }));
  },

  async fetchPayout(id: number): Promise<Payout> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payouts/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string amounts to numbers
    return {
      ...data,
      payout_amount: data.payout_amount ? Number(data.payout_amount) : 0,
      payout_fee: data.payout_fee ? Number(data.payout_fee) : 0,
    };
  },

  async createPayout(payoutData: CreatePayoutRequest): Promise<Payout> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payouts`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(payoutData),
    });

    const data = await handleApiResponse(response);
    const payout = Array.isArray(data) ? data[0] : data;
    
    // FIXED: Convert string amounts to numbers
    return {
      ...payout,
      payout_amount: payout.payout_amount ? Number(payout.payout_amount) : 0,
      payout_fee: payout.payout_fee ? Number(payout.payout_fee) : 0,
    };
  },

  async updatePayout(id: number, payoutData: UpdatePayoutRequest): Promise<Payout> {
    const response = await fetch(`${ORGANIZER_API}/api.php/payouts/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(payoutData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string amounts to numbers
    return {
      ...data,
      payout_amount: data.payout_amount ? Number(data.payout_amount) : 0,
      payout_fee: data.payout_fee ? Number(data.payout_fee) : 0,
    };
  },

  // Transaction endpoints
  async fetchTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${ORGANIZER_API}/api.php/transactions`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const transactions = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string amounts to numbers
    return transactions.map(transaction => ({
      ...transaction,
      amount: transaction.amount ? Number(transaction.amount) : 0,
    }));
  },

  async fetchTransaction(id: number): Promise<Transaction> {
    const response = await fetch(`${ORGANIZER_API}/api.php/transactions/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string amounts to numbers
    return {
      ...data,
      amount: data.amount ? Number(data.amount) : 0,
    };
  },

  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const response = await fetch(`${ORGANIZER_API}/api.php/transactions`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(transactionData),
    });

    const data = await handleApiResponse(response);
    const transaction = Array.isArray(data) ? data[0] : data;
    
    // FIXED: Convert string amounts to numbers
    return {
      ...transaction,
      amount: transaction.amount ? Number(transaction.amount) : 0,
    };
  },

  async updateTransaction(id: number, transactionData: UpdateTransactionRequest): Promise<Transaction> {
    const response = await fetch(`${ORGANIZER_API}/api.php/transactions/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(transactionData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string amounts to numbers
    return {
      ...data,
      amount: data.amount ? Number(data.amount) : 0,
    };
  },
};