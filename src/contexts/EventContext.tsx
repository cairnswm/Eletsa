import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, TicketType, Comment, Organizer, EventContextType } from '../types/event';
import { eventsApi } from '../services/events';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<number | null>(null);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // FIXED: Add caching for ticket types to prevent redundant fetches
  const [ticketTypesCache, setTicketTypesCache] = useState<{ [eventId: number]: TicketType[] }>({});
  const [ticketTypesFetched, setTicketTypesFetched] = useState<Set<number>>(new Set());

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all events...');
      const eventsData = await eventsApi.fetchEvents();
      console.log(`Fetched ${eventsData.length} events`);
      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventsApi.fetchEvent(eventId);
      setActiveEvent(eventData);
      return eventData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
      console.error('Failed to fetch event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Improved ticket types fetching with caching and deduplication
  const fetchEventTicketTypes = async (eventId: number): Promise<TicketType[]> => {
    // Check if already fetched or currently fetching
    if (ticketTypesFetched.has(eventId)) {
      console.log(`Ticket types for event ${eventId} already fetched, returning cached data`);
      return ticketTypesCache[eventId] || [];
    }

    // Mark as being fetched to prevent duplicate requests
    setTicketTypesFetched(prev => new Set([...prev, eventId]));

    try {
      setError(null);
      console.log(`Fetching ticket types for event ${eventId}...`);
      const ticketTypesData = await eventsApi.fetchEventTicketTypes(eventId);
      console.log(`Fetched ${ticketTypesData.length} ticket types for event ${eventId}`);
      
      // Update cache
      setTicketTypesCache(prev => ({
        ...prev,
        [eventId]: ticketTypesData
      }));
      
      // Update current ticket types if this is the active event
      if (activeEventId === eventId) {
        setTicketTypes(ticketTypesData);
      }
      
      return ticketTypesData;
    } catch (err) {
      // Remove from fetched set on error so it can be retried
      setTicketTypesFetched(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket types');
      console.error('Failed to fetch ticket types:', err);
      throw err;
    }
  };

  // FIXED: Get ticket types from cache without fetching
  const getEventTicketTypes = (eventId: number): TicketType[] => {
    return ticketTypesCache[eventId] || [];
  };

  // FIXED: Force refresh ticket types (clear cache and re-fetch)
  const refreshEventTicketTypes = async (eventId: number): Promise<TicketType[]> => {
    console.log(`Force refreshing ticket types for event ${eventId}`);
    
    // Clear cache and fetched status
    setTicketTypesFetched(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
    
    setTicketTypesCache(prev => {
      const newCache = { ...prev };
      delete newCache[eventId];
      return newCache;
    });
    
    return fetchEventTicketTypes(eventId);
  };

  const fetchEventComments = async (eventId: number) => {
    try {
      setError(null);
      const commentsData = await eventsApi.fetchEventComments(eventId);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      console.error('Failed to fetch comments:', err);
    }
  };

  const fetchOrganizer = async (organizerId: number) => {
    try {
      setError(null);
      // Mock organizer data since the API endpoint wasn't provided
      const mockOrganizer: Organizer = {
        id: organizerId,
        name: 'Event Organizer',
        email: 'organizer@example.com',
        description: 'Passionate about creating amazing local events and bringing communities together.',
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
        verified: true,
        rating: 4.8,
        events_count: 12,
      };
      setOrganizer(mockOrganizer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizer');
      console.error('Failed to fetch organizer:', err);
    }
  };

  const setActiveEventId = async (id: number | null) => {
    setActiveEventIdState(id);
    
    if (id === null) {
      setActiveEvent(null);
      setTicketTypes([]);
      setComments([]);
      setOrganizer(null);
      return;
    }

    // Check if event exists in current events list
    const existingEvent = events.find(event => event.id === id);
    
    if (existingEvent) {
      setActiveEvent(existingEvent);
      
      // Set ticket types from cache if available
      const cachedTicketTypes = ticketTypesCache[id];
      if (cachedTicketTypes) {
        console.log(`Using cached ticket types for event ${id}`);
        setTicketTypes(cachedTicketTypes);
      }
      
      // Fetch related data (only fetch ticket types if not cached)
      await Promise.all([
        cachedTicketTypes ? Promise.resolve(cachedTicketTypes) : fetchEventTicketTypes(id),
        fetchEventComments(id),
        fetchOrganizer(existingEvent.organizer_id),
      ]);
    } else {
      // Fetch event from API
      try {
        const eventData = await fetchEvent(id);
        // Fetch related data
        await Promise.all([
          fetchEventTicketTypes(id),
          fetchEventComments(id),
          fetchOrganizer(eventData.organizer_id),
        ]);
      } catch (err) {
        console.error('Failed to fetch event details:', err);
      }
    }
  };

  // FIXED: Method to add a new event to the cache (for immediate display after creation)
  const addEventToCache = (newEvent: Event) => {
    console.log('Adding new event to cache:', newEvent);
    setEvents(prev => {
      // Check if event already exists to avoid duplicates
      const exists = prev.some(event => event.id === newEvent.id);
      if (exists) {
        console.log('Event already exists in cache, updating...');
        return prev.map(event => event.id === newEvent.id ? newEvent : event);
      } else {
        console.log('Adding new event to cache');
        return [...prev, newEvent];
      }
    });
  };

  // Clear caches when events change
  useEffect(() => {
    // Clear ticket types cache when events are refreshed
    setTicketTypesCache({});
    setTicketTypesFetched(new Set());
  }, [events.length]); // Only clear when the number of events changes

  useEffect(() => {
    fetchEvents();
  }, []);

  const value: EventContextType = {
    events,
    activeEventId,
    activeEvent,
    ticketTypes,
    comments,
    organizer,
    loading,
    error,
    fetchEvents,
    setActiveEventId,
    fetchEventTicketTypes,
    getEventTicketTypes, // ADDED: New method to get cached ticket types
    refreshEventTicketTypes, // ADDED: New method to force refresh
    fetchEventComments,
    fetchOrganizer,
    addEventToCache,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};