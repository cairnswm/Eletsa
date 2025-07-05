import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organizer,
  PayoutRequest,
  Payout,
  Transaction,
  OrganizerContextType,
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
import { organizersApi } from '../services/organizers';
import { useUser } from './UserContext';
import { useAuth } from './AuthContext';

const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

export const useOrganizer = () => {
  const context = useContext(OrganizerContext);
  if (context === undefined) {
    throw new Error('useOrganizer must be used within an OrganizerProvider');
  }
  return context;
};

export const OrganizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { fetchBulkUsersFromRelations } = useUser();
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [organizerEventsFetched, setOrganizerEventsFetched] = useState<Set<number>>(new Set());
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  // Utility function to bulk fetch user details for organizers
  const fetchOrganizerUsers = async (organizerList: Organizer[]) => {
    const userIds = organizerList.map(organizer => organizer.user_id);
    if (userIds.length > 0) {
      try {
        // Create fake follow relations to trigger bulk user fetch
        const fakeRelations = userIds.map(userId => ({
          id: 0,
          follower_user_id: userId,
          followed_user_id: userId,
          created_at: '',
          modified_at: '',
        }));
        await fetchBulkUsersFromRelations(fakeRelations);
      } catch (err) {
        console.error('Failed to bulk fetch organizer users:', err);
      }
    }
  };

  // Organizer methods
  const fetchOrganizers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const organizersData = await organizersApi.fetchOrganizers();
      setOrganizers(organizersData);
      
      // Bulk fetch user details for all organizers
      await fetchOrganizerUsers(organizersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizers';
      setError(errorMessage);
      console.error('Failed to fetch organizers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizer = async (id: number): Promise<Organizer> => {
    try {
      setLoading(true);
      setError(null);
      const organizerData = await organizersApi.fetchOrganizer(id);
      
      // Update organizers cache
      setOrganizers(prev => {
        const existingIndex = prev.findIndex(org => org.id === id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = organizerData;
          return updated;
        } else {
          return [...prev, organizerData];
        }
      });

      // Fetch user details for this organizer
      await fetchOrganizerUsers([organizerData]);
      
      return organizerData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizer';
      setError(errorMessage);
      console.error('Failed to fetch organizer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrganizer = (id: number): Organizer | null => {
    const organizer = organizers.find(org => org.id === id);
    
    // If organizer doesn't exist in cache, automatically fetch it
    if (!organizer) {
      fetchOrganizer(id).catch(console.error);
      return null;
    }
    
    return organizer;
  };

  const getOrganizerByUserId = (userId: number): Organizer | null => {
    return organizers.find(org => org.user_id === userId) || null;
  };

  const createOrganizer = async (data: CreateOrganizerRequest): Promise<Organizer> => {
    try {
      setLoading(true);
      setError(null);
      const newOrganizer = await organizersApi.createOrganizer(data);
      
      setOrganizers(prev => [...prev, newOrganizer]);
      
      // Fetch user details for the new organizer
      await fetchOrganizerUsers([newOrganizer]);
      
      return newOrganizer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create organizer';
      setError(errorMessage);
      console.error('Failed to create organizer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganizer = async (id: number, data: UpdateOrganizerRequest): Promise<Organizer> => {
    try {
      setLoading(true);
      setError(null);
      const updatedOrganizer = await organizersApi.updateOrganizer(id, data);
      
      setOrganizers(prev => 
        prev.map(org => org.id === id ? updatedOrganizer : org)
      );
      
      return updatedOrganizer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update organizer';
      setError(errorMessage);
      console.error('Failed to update organizer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Organizer Events methods
  // FIXED: Use user ID instead of organizer ID since organizer_id field links to user table
  const fetchOrganizerEvents = async (userId: number): Promise<Event[]> => {
    try {
      setError(null);
      console.log(`Fetching organizer events for user ID: ${userId}`);
      
      const eventsData = await organizersApi.fetchOrganizerEvents(userId);
      
      console.log(`Received ${eventsData.length} events for user ID: ${userId}`, eventsData);
      
      // FIXED: Update cache with organizer-specific events
      // Clear existing events for this user and add new ones
      setOrganizerEvents(prev => {
        const filtered = prev.filter(event => event.organizer_id !== userId);
        const newEvents = [...filtered, ...eventsData];
        console.log(`Updated organizer events cache. Total events: ${newEvents.length}`);
        return newEvents;
      });

      // Mark as fetched
      setOrganizerEventsFetched(prev => new Set([...prev, userId]));
      
      return eventsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizer events';
      setError(errorMessage);
      console.error('Failed to fetch organizer events:', err);
      throw err;
    }
  };

  const getOrganizerEvents = (userId: number): Event[] => {
    // Filter events where organizer_id matches the user ID
    const events = organizerEvents.filter(event => event.organizer_id === userId);
    console.log(`Getting organizer events for user ID ${userId}: ${events.length} events found`);
    return events;
  };

  // Force refresh organizer events (for after creating/updating events)
  const refreshOrganizerEvents = async (userId: number): Promise<Event[]> => {
    console.log(`Refreshing organizer events for user ID: ${userId}`);
    
    // Remove from fetched set to force re-fetch
    setOrganizerEventsFetched(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    
    return fetchOrganizerEvents(userId);
  };

  // Payout Request methods
  const fetchPayoutRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const payoutRequestsData = await organizersApi.fetchPayoutRequests();
      setPayoutRequests(payoutRequestsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payout requests';
      setError(errorMessage);
      console.error('Failed to fetch payout requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizerPayoutRequests = async (organizerId: number): Promise<PayoutRequest[]> => {
    try {
      setError(null);
      const payoutRequestsData = await organizersApi.fetchOrganizerPayoutRequests(organizerId);
      
      // Update cache with organizer-specific payout requests
      setPayoutRequests(prev => {
        const filtered = prev.filter(pr => pr.organizer_id !== organizerId);
        return [...filtered, ...payoutRequestsData];
      });
      
      return payoutRequestsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizer payout requests';
      setError(errorMessage);
      console.error('Failed to fetch organizer payout requests:', err);
      throw err;
    }
  };

  const createPayoutRequest = async (data: CreatePayoutRequestRequest): Promise<PayoutRequest> => {
    try {
      setLoading(true);
      setError(null);
      const newPayoutRequest = await organizersApi.createPayoutRequest(data);
      
      setPayoutRequests(prev => [...prev, newPayoutRequest]);
      
      return newPayoutRequest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payout request';
      setError(errorMessage);
      console.error('Failed to create payout request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePayoutRequest = async (id: number, data: UpdatePayoutRequestRequest): Promise<PayoutRequest> => {
    try {
      setLoading(true);
      setError(null);
      const updatedPayoutRequest = await organizersApi.updatePayoutRequest(id, data);
      
      setPayoutRequests(prev => 
        prev.map(pr => pr.id === id ? updatedPayoutRequest : pr)
      );
      
      return updatedPayoutRequest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payout request';
      setError(errorMessage);
      console.error('Failed to update payout request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Payout methods
  const fetchPayouts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const payoutsData = await organizersApi.fetchPayouts();
      setPayouts(payoutsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payouts';
      setError(errorMessage);
      console.error('Failed to fetch payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizerPayouts = async (organizerId: number): Promise<Payout[]> => {
    try {
      setError(null);
      const payoutsData = await organizersApi.fetchOrganizerPayouts(organizerId);
      
      // Update cache with organizer-specific payouts
      setPayouts(prev => {
        const filtered = prev.filter(p => p.organizer_id !== organizerId);
        return [...filtered, ...payoutsData];
      });
      
      return payoutsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizer payouts';
      setError(errorMessage);
      console.error('Failed to fetch organizer payouts:', err);
      throw err;
    }
  };

  const createPayout = async (data: CreatePayoutRequest): Promise<Payout> => {
    try {
      setLoading(true);
      setError(null);
      const newPayout = await organizersApi.createPayout(data);
      
      setPayouts(prev => [...prev, newPayout]);
      
      return newPayout;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payout';
      setError(errorMessage);
      console.error('Failed to create payout:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePayout = async (id: number, data: UpdatePayoutRequest): Promise<Payout> => {
    try {
      setLoading(true);
      setError(null);
      const updatedPayout = await organizersApi.updatePayout(id, data);
      
      setPayouts(prev => 
        prev.map(p => p.id === id ? updatedPayout : p)
      );
      
      return updatedPayout;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payout';
      setError(errorMessage);
      console.error('Failed to update payout:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Transaction methods
  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const transactionsData = await organizersApi.fetchTransactions();
      setTransactions(transactionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizerTransactions = async (organizerId: number): Promise<Transaction[]> => {
    try {
      setError(null);
      const transactionsData = await organizersApi.fetchOrganizerTransactions(organizerId);
      
      // Update cache with organizer-specific transactions
      setTransactions(prev => {
        const filtered = prev.filter(t => t.organizer_id !== organizerId);
        return [...filtered, ...transactionsData];
      });
      
      return transactionsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizer transactions';
      setError(errorMessage);
      console.error('Failed to fetch organizer transactions:', err);
      throw err;
    }
  };

  const createTransaction = async (data: CreateTransactionRequest): Promise<Transaction> => {
    try {
      setLoading(true);
      setError(null);
      const newTransaction = await organizersApi.createTransaction(data);
      
      setTransactions(prev => [...prev, newTransaction]);
      
      return newTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      console.error('Failed to create transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: number, data: UpdateTransactionRequest): Promise<Transaction> => {
    try {
      setLoading(true);
      setError(null);
      const updatedTransaction = await organizersApi.updateTransaction(id, data);
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(errorMessage);
      console.error('Failed to update transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load organizers on mount
  useEffect(() => {
    fetchOrganizers();
  }, []);

  // Clear organizer events cache when user changes
  useEffect(() => {
    if (!user) {
      setOrganizerEvents([]);
      setOrganizerEventsFetched(new Set());
    }
  }, [user?.id]);

  const value: OrganizerContextType = {
    organizers,
    organizerEvents,
    payoutRequests,
    payouts,
    transactions,
    loading,
    error,
    
    // Organizer methods
    fetchOrganizers,
    fetchOrganizer,
    getOrganizer,
    getOrganizerByUserId,
    createOrganizer,
    updateOrganizer,
    
    // Organizer Events methods
    fetchOrganizerEvents,
    getOrganizerEvents,
    refreshOrganizerEvents,
    
    // Payout Request methods
    fetchPayoutRequests,
    fetchOrganizerPayoutRequests,
    createPayoutRequest,
    updatePayoutRequest,
    
    // Payout methods
    fetchPayouts,
    fetchOrganizerPayouts,
    createPayout,
    updatePayout,
    
    // Transaction methods
    fetchTransactions,
    fetchOrganizerTransactions,
    createTransaction,
    updateTransaction,
    
    // Utility methods
    clearError,
  };

  return <OrganizerContext.Provider value={value}>{children}</OrganizerContext.Provider>;
};