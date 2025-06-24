import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { events as eventsData } from '../data/events';
import { reviews as reviewsData } from '../data/reviews';
import { tickets as ticketsData } from '../data/tickets';
import { categories as categoriesData } from '../data/categories';
import { comments as commentsData } from '../data/comments';
import { favorites as favoritesData } from '../data/favorites';

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  tags: string[];
  category: string;
  organizerId: string;
  agenda: string;
  maxParticipants: number;
  price: number;
  sold: number;
  description: string;
  image?: string;
}

interface Review {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  isTestimonial?: boolean;
}

interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  price: number;
  status: string;
  purchaseDate: string;
}

interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  timestamp: string;
  parentId: string | null;
}

interface Favorite {
  id: string;
  userId: string;
  eventId: string;
  timestamp: string;
}

interface Category {
  id: string;
  label: string;
}

interface EventContextType {
  events: Event[];
  reviews: Review[];
  tickets: Ticket[];
  categories: Category[];
  comments: Comment[];
  favorites: Favorite[];
  activeEventId: string | null;
  activeEvent: Event | null;
  setActiveEventId: (id: string | null) => void;
  getEventReviews: (eventId: string) => Review[];
  getUserTickets: (userId: string) => Ticket[];
  purchaseTicket: (eventId: string, quantity: number, userId: string) => void;
  isPastEvent: (event: Event) => boolean;
  getAverageRating: (eventId: string) => number;
  getEventComments: (eventId: string) => Comment[];
  addComment: (eventId: string, userId: string, userName: string, userRole: string, comment: string, parentId?: string | null) => void;
  deleteComment: (commentId: string) => Promise<void>;
  toggleFavorite: (eventId: string, userId: string) => void;
  isEventFavorited: (eventId: string, userId: string) => boolean;
  getEventFavoriteCount: (eventId: string) => number;
  getUserFavorites: (userId: string) => string[];
  addEvent: (eventData: Partial<Event>) => Promise<void>;
  updateEvent: (eventId: string, eventData: Partial<Event>) => Promise<void>;
  toggleReviewTestimonial: (reviewId: string) => void;
  getOrganizerTestimonials: (organizerId: string) => Review[];
  getOrganizerCompletedEvents: (organizerId: string) => Event[];
  getOrganizerRevenue: (organizerId: string) => { gross: number; net: number; platformFee: number };
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [reviews, setReviews] = useState<Review[]>(reviewsData);
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [categories] = useState<Category[]>(categoriesData);
  const [comments, setComments] = useState<Comment[]>(commentsData);
  const [favorites, setFavorites] = useState<Favorite[]>(favoritesData);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

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
        id: `ticket-${Date.now()}`,
        userId,
        eventId,
        quantity,
        price: event.price * quantity,
        status: 'active',
        purchaseDate: new Date().toISOString().split('T')[0]
      };
      setTickets(prev => [...prev, newTicket]);
      
      // Update event sold count
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, sold: e.sold + quantity } : e
      ));
    }
  };

  const isPastEvent = (event: Event) => {
    return new Date(event.date) < new Date();
  };

  const getAverageRating = (eventId: string) => {
    const eventReviews = getEventReviews(eventId);
    if (eventReviews.length === 0) return 0;
    const sum = eventReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / eventReviews.length;
  };

  const getEventComments = (eventId: string) => {
    return comments.filter(comment => comment.eventId === eventId);
  };

  const addComment = (eventId: string, userId: string, userName: string, userRole: string, comment: string, parentId: string | null = null) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      eventId,
      userId,
      userName,
      userRole,
      comment,
      timestamp: new Date().toISOString(),
      parentId
    };
    setComments(prev => [...prev, newComment]);
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
        id: `favorite-${Date.now()}`,
        userId,
        eventId,
        timestamp: new Date().toISOString()
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

  const getOrganizerRevenue = (organizerId: string) => {
    const organizerEvents = events.filter(event => event.organizerId === organizerId);
    const organizerEventIds = organizerEvents.map(event => event.id);
    const organizerTickets = tickets.filter(ticket => 
      organizerEventIds.includes(ticket.eventId)
    );

    const grossRevenue = organizerTickets.reduce((sum, ticket) => sum + ticket.price, 0);
    
    // Get organizer's fee percentage (this would come from user context in real implementation)
    // For now, we'll assume 15% platform fee for organizers
    const platformFeePercentage = 15;
    const platformFee = (grossRevenue * platformFeePercentage) / 100;
    const netRevenue = grossRevenue - platformFee;

    return {
      gross: grossRevenue,
      net: netRevenue,
      platformFee: platformFee
    };
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
      getEventReviews,
      getUserTickets,
      purchaseTicket,
      isPastEvent,
      getAverageRating,
      getEventComments,
      addComment,
      deleteComment,
      toggleFavorite,
      isEventFavorited,
      getEventFavoriteCount,
      getUserFavorites,
      addEvent,
      updateEvent,
      toggleReviewTestimonial,
      getOrganizerTestimonials,
      getOrganizerCompletedEvents,
      getOrganizerRevenue
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}