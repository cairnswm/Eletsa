import React, { createContext, useContext, useState, ReactNode } from 'react';
import { events as eventsData } from '../data/events';
import { reviews as reviewsData } from '../data/reviews';
import { tickets as ticketsData } from '../data/tickets';
import { categories as categoriesData } from '../data/categories';
import { comments as commentsData } from '../data/comments';
import { favorites as favoritesData } from '../data/favorites';
import { Event, Review, Ticket, Comment, Favorite, Category, EventContextType } from '../types/event.types';
import { formatDate, isPastDate, getCurrentTimestamp } from '../utils/dateUtils';
import { addComment, getEventComments, setInitialComments } from '../utils/commentsUtils';

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [reviews, setReviews] = useState<Review[]>(reviewsData);
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [categories] = useState<Category[]>(categoriesData);
  const [comments, setComments] = useState<Comment[]>(commentsData);
  const [favorites, setFavorites] = useState<Favorite[]>(favoritesData);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  setInitialComments(commentsData);

  const activeEvent = activeEventId ? events.find(e => e.id === activeEventId) || null : null;

  const getEventReviews = (eventId: string) => {
    return reviews.filter(review => review.eventId === eventId);
  };

  const getUserTickets = (userId: string) => {
    return tickets.filter(ticket => ticket.userId === userId);
  };

  const purchaseTicket = (eventId: string, quantity: number, userId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const newTicket: Ticket = {
        id: `ticket-${getCurrentTimestamp()}`,
        userId,
        eventId,
        quantity,
        price: event.price * quantity,
        status: 'active',
        purchaseDate: formatDate(new Date().toISOString())
      };
      setTickets(prev => [...prev, newTicket]);

      // Update event sold count
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, sold: e.sold + quantity } : e
      ));
    }
  };

  const isPastEvent = (event: Event) => {
    return isPastDate(event.date);
  };

  const getAverageRating = (eventId: string) => {
    const eventReviews = getEventReviews(eventId);
    if (eventReviews.length === 0) return 0;
    const sum = eventReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / eventReviews.length;
  };

  const deleteComment = async (commentId: string) => {
    // Remove the comment and all its replies
    setComments(prev => prev.filter(comment => 
      comment.id !== commentId && comment.parentId !== commentId
    ));
  };

  const toggleFavorite = (eventId: string, userId: string) => {
    const existingFavorite = favorites.find(fav => fav.eventId === eventId && fav.userId === userId);

    if (existingFavorite) {
      // Remove favorite
      setFavorites(prev => prev.filter(fav => fav.id !== existingFavorite.id));
    } else {
      // Add favorite
      const newFavorite: Favorite = {
        id: `favorite-${getCurrentTimestamp()}`,
        userId,
        eventId,
        timestamp: getCurrentTimestamp()
      };
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const isEventFavorited = (eventId: string, userId: string) => {
    return favorites.some(fav => fav.eventId === eventId && fav.userId === userId);
  };

  const getEventFavoriteCount = (eventId: string) => {
    return favorites.filter(fav => fav.eventId === eventId).length;
  };

  const getUserFavorites = (userId: string) => {
    return favorites.filter(fav => fav.userId === userId).map(fav => fav.eventId);
  };

  const addEvent = async (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: eventData.title || '',
      location: eventData.location || '',
      coordinates: eventData.coordinates,
      date: eventData.date || '',
      tags: eventData.tags || [],
      category: eventData.category || '',
      organizerId: eventData.organizerId || '',
      agenda: eventData.agenda || '',
      maxParticipants: eventData.maxParticipants || 50,
      price: eventData.price || 0,
      sold: 0,
      description: eventData.description || '',
      image: eventData.image
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...eventData }
        : event
    ));
  };

  const toggleReviewTestimonial = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isTestimonial: !review.isTestimonial }
        : review
    ));
  };

  const getOrganizerTestimonials = (organizerId: string) => {
    const organizerEvents = events.filter(event => event.organizerId === organizerId);
    const organizerEventIds = organizerEvents.map(event => event.id);
    
    return reviews.filter(review => 
      organizerEventIds.includes(review.eventId) && review.isTestimonial === true
    );
  };

  const getOrganizerCompletedEvents = (organizerId: string) => {
    return events.filter(event => 
      event.organizerId === organizerId && isPastEvent(event)
    );
  };

  return (
    <EventContext.Provider value={{
      events,
      reviews,
      tickets,
      categories,
      comments,
      favorites,
      activeEventId,
      activeEvent,
      setActiveEventId,
      addComment,
      getEventComments,
      getEventReviews,
      getUserTickets,
      purchaseTicket,
      isPastEvent,
      getAverageRating,
      deleteComment,
      toggleFavorite,
      isEventFavorited,
      getEventFavoriteCount,
      getUserFavorites,
      addEvent,
      updateEvent,
      toggleReviewTestimonial,
      getOrganizerTestimonials,
      getOrganizerCompletedEvents
    }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export { EventContext };