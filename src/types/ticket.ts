export interface UserTicket {
  event_title: string;
  start_datetime: string;
  location_name: string;
  location_latitude: string;
  location_longitude: string;
  ticket_type: string;
  price: string;
  quantity: number;
  ticket_code: string;
  assigned_at: string;
  used: number;
}

export interface TicketContextType {
  tickets: UserTicket[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  refreshTickets: () => Promise<void>;
  clearError: () => void;
}