import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserTicket, TicketContextType, CreateReviewRequest } from '../types/ticket';
import { ticketsApi, CreateReviewRequest as ServiceCreateReviewRequest } from '../services/tickets';
import { useAuth } from './AuthContext';
import { useEvent } from './EventContext';

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
  const { events } = useEvent();
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

  const submitReview = async (eventTitle: string, rating: number, review: string) => {
    if (!user) {
      throw new Error('User must be logged in to submit a review');
    }

    // Find the event ID by matching the event title
    const event = events.find(e => e.title === eventTitle);
    if (!event) {
      throw new Error('Event not found');
    }

    try {
      setError(null);
      
      // Submit review to API
      await ticketsApi.createReview({
        user_id: user.id,
        event_id: event.id,
        rating,
        review,
      });

      // Update the ticket in memory with the new rating and review
      setTickets(prev => prev.map(ticket => 
        ticket.event_title === eventTitle 
          ? { ...ticket, rating, review }
          : ticket
      ));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
      setError(errorMessage);
      console.error('Failed to submit review:', err);
      throw err;
    }
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
    submitReview,
    clearError,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export { TicketContext }