export interface Event {
  id: string;
  title: string;
  location: string;
  coordinates?: { lat: number; lng: number };
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

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  isTestimonial?: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  price: number;
  status: string;
  purchaseDate: string;
}

export interface TicketWithEvent {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  price: number;
  status: string;
  purchaseDate: string;
  event: Event;
}

export interface Comment {
  id: number;
  eventId: string; // Changed from number to string
  userId: string; // Changed from number to string
  userName: string;
  userRole: string;
  comment: string;
  timestamp: string;
  parentId: string | null; // Changed from number | null to string | null
  image?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  eventId: string;
  timestamp: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface EventContextType {
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
}

