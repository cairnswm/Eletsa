export interface UserTicket {
  event_title: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  location_latitude: string;
  location_longitude: string;
  ticket_type: string;
  price: string;
  quantity: number;
  ticket_code: string;
  assigned_at: string;
  used: number;
  rating: number | null;
  review: string | null;
}

export interface CreateReviewRequest {
  user_id: number;
  event_id: number;
  rating: number;
  review: string;
}

export interface TicketContextType {
  tickets: UserTicket[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  refreshTickets: () => Promise<void>;
  submitReview: (eventTitle: string, rating: number, review: string) => Promise<void>;
  clearError: () => void;
}