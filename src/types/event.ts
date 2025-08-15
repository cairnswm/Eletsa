export interface Event {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  category: string;
  tags: string;
  location_name: string;
  location_latitude: number;
  location_longitude: number;
  start_datetime: string;
  end_datetime: string;
  max_attendees: number;
  status: string;
  images: string;
  videos: string;
  code: string;
  popularity_score: number;
  created_at: string;
  modified_at: string;
}

export interface TicketType {
  id: number;
  event_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  quantity_sold: number;
  refundable: boolean;
  created_at: string;
  modified_at: string;
}

export interface Comment {
  id: number;
  event_id: number;
  user_id: number;
  content: string;
  parent_comment_id: number | null;
  likes: number;
  is_moderated: boolean;
  is_visible: boolean;
  created_at: string;
  modified_at: string;
}

export interface Review {
  id: number;
  event_id: number;
  user_id: number;
  rating: number;
  review: string;
  created_at: string;
  modified_at: string;
}

export interface Organizer {
  id: number;
  name: string;
  email: string;
  description?: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  events_count: number;
}

export interface EventContextType {
  events: Event[];
  activeEventId: number | null;
  activeEvent: Event | null;
  ticketTypes: TicketType[];
  comments: Comment[];
  reviews: Review[];
  organizer: Organizer | null;
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  setActiveEventId: (id: number | null) => void;
  fetchEventTicketTypes: (eventId: number) => Promise<TicketType[]>;
  getEventTicketTypes: (eventId: number) => TicketType[]; // ADDED: Get cached ticket types
  refreshEventTicketTypes: (eventId: number) => Promise<TicketType[]>; // ADDED: Force refresh
  invalidateEventTicketTypes: (eventId: number) => void; // ADDED: Invalidate cache
  fetchEventComments: (eventId: number) => Promise<void>;
  fetchEventReviews: (eventId: number) => Promise<void>;
  fetchOrganizer: (organizerId: number) => Promise<void>;
  addEventToCache: (newEvent: Event) => void;
}