import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { events as eventsData } from '../data/events';
import { reviews as reviewsData } from '../data/reviews';
import { tickets as ticketsData } from '../data/tickets';
import { categories as categoriesData } from '../data/categories';
import { comments as commentsData } from '../data/comments';
import { favorites as favoritesData } from '../data/favorites';

interface Event {
  id: number;
  title: string;
  location: string;
  date: string;
  tags: string[];
  category: string;
  organizerId: number;
  agenda: string;
  maxParticipants: number;
  price: number;
  sold: number;
  description: string;
  image?: string;
}

interface Review {
  id: number;
  eventId: number;
  userId: number;
  rating: number;
  comment: string;
  date: string;
  isTestimonial?: boolean;
}

interface Ticket {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  price: number;
  status: string;
  purchaseDate: string;
}

interface Comment {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  userRole: string;
  comment: string;
  timestamp: string;
  parentId: number | null;
}

interface Favorite {
  id: number;
  userId: number;
  eventId: number;
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
  activeEventId: number | null;
  activeEvent: Event | null;
  setActiveEventId: (id: number | null) => void;
  getEventReviews: (eventId: number) => Review[];
  getUserTickets: (userId: number) => Ticket[];
  purchaseTicket: (eventId: number, quantity: number, userId: number) => void;
  isPastEvent: (event: Event) => boolean;
  getAverageRating: (eventId: number) => number;
  getEventComments: (eventId: number) => Comment[];
  addComment: (eventId: number, userId: number, userName: string, userRole: string, comment: string, parentId?: number | null) => void;
  deleteComment: (commentId: number) => Promise<void>;
  toggleFavorite: (eventId: number, userId: number) => void;
  isEventFavorited: (eventId: number, userId: number) => boolean;
  getEventFavoriteCount: (eventId: number) => number;
  getUserFavorites: (userId: number) => number[];
  addEvent: (eventData: Partial<Event>) => Promise<void>;
  updateEvent: (eventId: number, eventData: Partial<Event>) => Promise<void>;
  toggleReviewTestimonial: (reviewId: number) => void;
  getOrganizerTestimonials: (organizerId: number) => Review[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [reviews, setReviews] = useState<Review[]>(reviewsData);
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [categories] = useState<Category[]>(categoriesData);
  const [comments, setComments] = useState<Comment[]>(commentsData);
  const [favorites, setFavorites] = useState<Favorite[]>(favoritesData);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);

  const activeEvent = activeEventId ? events.find(e => e.id === activeEventId) || null : null;

  const getEventReviews = (eventId: number) => {
    return reviews.filter(review => review.eventId === eventId);
  };

  const getUserTickets = (userId: number) => {
    return tickets.filter(ticket => ticket.userId === userId);
  };

  const purchaseTicket = (eventId: number, quantity: number, userId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const newTicket: Ticket = {
        id: Date.now(),
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

  const getAverageRating = (eventId: number) => {
    const eventReviews = getEventReviews(eventId);
    if (eventReviews.length === 0) return 0;
    const sum = eventReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / eventReviews.length;
  };

  const getEventComments = (eventId: number) => {
    return comments.filter(comment => comment.eventId === eventId);
  };

  const addComment = (eventId: number, userId: number, userName: string, userRole: string, comment: string, parentId: number | null = null) => {
    const newComment: Comment = {
      id: Date.now(),
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

  const deleteComment = async (commentId: number) => {
    // Remove the comment and all its replies
    setComments(prev => prev.filter(comment => 
      comment.id !== commentId && comment.parentId !== commentId
    ));
  };

  const toggleFavorite = (eventId: number, userId: number) => {
    const existingFavorite = favorites.find(fav => fav.eventId === eventId && fav.userId === userId);
    
    if (existingFavorite) {
      // Remove favorite
      setFavorites(prev => prev.filter(fav => fav.id !== existingFavorite.id));
    } else {
      // Add favorite
      const newFavorite: Favorite = {
        id: Date.now(),
        userId,
        eventId,
        timestamp: new Date().toISOString()
      };
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const isEventFavorited = (eventId: number, userId: number) => {
    return favorites.some(fav => fav.eventId === eventId && fav.userId === userId);
  };

  const getEventFavoriteCount = (eventId: number) => {
    return favorites.filter(fav => fav.eventId === eventId).length;
  };

  const getUserFavorites = (userId: number) => {
    return favorites.filter(fav => fav.userId === userId).map(fav => fav.eventId);
  };

  const addEvent = async (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: Math.max(...events.map(e => e.id)) + 1,
      title: eventData.title || '',
      location: eventData.location || '',
      date: eventData.date || '',
      tags: eventData.tags || [],
      category: eventData.category || '',
      organizerId: eventData.organizerId || 0,
      agenda: eventData.agenda || '',
      maxParticipants: eventData.maxParticipants || 50,
      price: eventData.price || 0,
      sold: 0,
      description: eventData.description || '',
      image: eventData.image
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = async (eventId: number, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...eventData }
        : event
    ));
  };

  const toggleReviewTestimonial = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isTestimonial: !review.isTestimonial }
        : review
    ));
  };

  const getOrganizerTestimonials = (organizerId: number) => {
    const organizerEvents = events.filter(event => event.organizerId === organizerId);
    const organizerEventIds = organizerEvents.map(event => event.id);
    
    return reviews.filter(review => 
      organizerEventIds.includes(review.eventId) && review.isTestimonial === true
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
      getOrganizerTestimonials
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