import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserTicket, TicketContextType } from '../types/ticket';
import { ticketsApi } from '../services/tickets';
import { useAuth } from './AuthContext';

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchTickets = React.useCallback(async () => {
    if (!user || !token) {
      setTickets([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const ticketsData = await ticketsApi.fetchUserTickets();
      setTickets(ticketsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  const refreshTickets = async () => {
    await fetchTickets();
  };

  // Fetch tickets when user changes
  useEffect(() => {
    if (user && token) {
      fetchTickets();
    } else {
      setTickets([]);
      setError(null);
    }
  }, [user?.id, token, fetchTickets]);

  // Clear tickets when user logs out
  useEffect(() => {
    if (!user) {
      setTickets([]);
      setError(null);
    }
  }, [user]);

  const value: TicketContextType = {
    tickets,
    loading,
    error,
    fetchTickets,
    refreshTickets,
    clearError,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export { TicketContext }