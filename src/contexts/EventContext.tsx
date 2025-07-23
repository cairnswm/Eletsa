import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Event,
  TicketType,
  Comment,
  Organizer,
  EventContextType,
} from "../types/event";
import { eventsApi } from "../services/events";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<number | null>(null);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentsFetched, setCommentsFetched] = useState<Set<number>>(
    new Set()
  );
  const [reviewsFetched, setReviewsFetched] = useState<Set<number>>(
    new Set()
  );
  const [ticketTypesCache, setTicketTypesCache] = useState<{
    [eventId: number]: TicketType[];
  }>({});
  const [ticketTypesFetched, setTicketTypesFetched] = useState<Set<number>>(
    new Set()
  );

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await eventsApi.fetchEvents();
      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
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
      setError(err instanceof Error ? err.message : "Failed to fetch event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEventTicketTypes = async (
    eventId: number
  ): Promise<TicketType[]> => {
    if (ticketTypesFetched.has(eventId)) {
      return ticketTypesCache[eventId] || [];
    }

    setTicketTypesFetched((prev) => new Set([...prev, eventId]));

    try {
      setError(null);
      const ticketTypesData = await eventsApi.fetchEventTicketTypes(eventId);
      console.log("Got Tickets for event", eventId, ticketTypesData);
      setTicketTypesCache((prev) => ({
        ...prev,
        [eventId]: ticketTypesData,
      }));

      console.log(
        "Setting ticket types for active event",
        eventId,
        ticketTypesData
      );
      setTicketTypes(ticketTypesData);

      return ticketTypesData;
    } catch (err) {
      setTicketTypesFetched((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });

      setError(
        err instanceof Error ? err.message : "Failed to fetch ticket types"
      );
      throw err;
    }
  };

  const getEventTicketTypes = (eventId: number): TicketType[] => {
    return ticketTypesCache[eventId] || [];
  };

  const refreshEventTicketTypes = async (
    eventId: number
  ): Promise<TicketType[]> => {
    setTicketTypesFetched((prev) => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });

    setTicketTypesCache((prev) => {
      const newCache = { ...prev };
      delete newCache[eventId];
      return newCache;
    });

    return fetchEventTicketTypes(eventId);
  };

  const invalidateEventTicketTypes = (eventId: number) => {
    setTicketTypesFetched((prev) => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });

    setTicketTypesCache((prev) => {
      const newCache = { ...prev };
      delete newCache[eventId];
      return newCache;
    });

    if (activeEventId === eventId) {
      setTicketTypes([]);
    }
  };

  const fetchEventComments = async (
    eventId: number,
    force: boolean = false
  ) => {
    if (!force && commentsFetched.has(eventId)) {
      return;
    }

    try {
      setError(null);
      const commentsData = await eventsApi.fetchEventComments(eventId);
      setComments(commentsData);
      setCommentsFetched((prev) => new Set([...prev, eventId]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
    }
  };

  const setActiveEventId = async (id: number | null) => {    
    if (activeEventId === id) {
      return;
    }
      setActiveEvent(null);
      setTicketTypes([]);
      setComments([]);
      setOrganizer(null);

    
    setActiveEventIdState(id);

    const existingEvent = events.find((event) => event.id === id);

    if (existingEvent) {
      setActiveEvent(existingEvent);

      await Promise.all([fetchEventTicketTypes(id), fetchEventComments(id)]);
    } else {
      try {
        await fetchEvent(id);
        await Promise.all([fetchEventTicketTypes(id), fetchEventComments(id)]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addEventToCache = (newEvent: Event) => {
    setEvents((prev) => {
      const exists = prev.some((event) => event.id === newEvent.id);
      if (exists) {
        return prev.map((event) =>
          event.id === newEvent.id ? newEvent : event
        );
      } else {
        return [...prev, newEvent];
      }
    });
  };

  useEffect(() => {
    setTicketTypesCache({});
    setTicketTypesFetched(new Set());
    setCommentsFetched(new Set());
  }, [events.length]);

  useEffect(() => {
    if (activeEventId === null) {
      setComments([]);
      setReviews([]);
      setOrganizer(null);
    }
  }, [activeEventId]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const value: EventContextType = {
    events,
    activeEventId,
    activeEvent,
    ticketTypes,
    comments,
    reviews,
    organizer,
    loading,
    error,
    fetchEvents,
    setActiveEventId,
    fetchEventTicketTypes,
    getEventTicketTypes,
    refreshEventTicketTypes,
    invalidateEventTicketTypes,
    fetchEventComments,
    fetchEventReviews,
    addEventToCache,
    fetchOrganizer: async () => {},
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
