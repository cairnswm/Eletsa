import { createHeaders, handleApiResponse } from './api';

let EVENTS_API = 'https://eletsa.cairns.co.za/php/events';
EVENTS_API = "http://localhost/eletsa-api/php/events";

export const eventsApi = {
  async fetchEvents() {
    const response = await fetch(`${EVENTS_API}/api.php/event`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const events = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string coordinates to numbers and handle null values
    return events.map(event => ({
      ...event,
      location_latitude: event.location_latitude ? Number(event.location_latitude) : 0,
      location_longitude: event.location_longitude ? Number(event.location_longitude) : 0,
      popularity_score: event.popularity_score ? Number(event.popularity_score) : 0,
      max_attendees: event.max_attendees ? Number(event.max_attendees) : 0,
    }));
  },

  async fetchEvent(eventId: number) {
    const response = await fetch(`${EVENTS_API}/api.php/event/${eventId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string coordinates to numbers and handle null values
    return {
      ...data,
      location_latitude: data.location_latitude ? Number(data.location_latitude) : 0,
      location_longitude: data.location_longitude ? Number(data.location_longitude) : 0,
      popularity_score: data.popularity_score ? Number(data.popularity_score) : 0,
      max_attendees: data.max_attendees ? Number(data.max_attendees) : 0,
    };
  },

  async fetchEventTicketTypes(eventId: number) {
    const response = await fetch(`${EVENTS_API}/api.php/event/${eventId}/ticket_types`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const ticketTypes = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string prices to numbers and handle null values
    return ticketTypes.map(ticketType => ({
      ...ticketType,
      price: ticketType.price ? Number(ticketType.price) : 0,
      quantity: ticketType.quantity ? Number(ticketType.quantity) : 0,
      quantity_sold: ticketType.quantity_sold ? Number(ticketType.quantity_sold) : 0,
    }));
  },

  async fetchEventComments(eventId: number) {
    const response = await fetch(`${EVENTS_API}/api.php/event/${eventId}/comments`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    const comments = Array.isArray(data) ? data : [data];
    
    // FIXED: Convert string numbers to actual numbers
    return comments.map(comment => ({
      ...comment,
      likes: comment.likes ? Number(comment.likes) : 0,
      event_id: Number(comment.event_id),
      user_id: Number(comment.user_id),
      parent_comment_id: comment.parent_comment_id ? Number(comment.parent_comment_id) : null,
    }));
  },

  async createEvent(eventData: {
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
  }) {
    const response = await fetch(`${EVENTS_API}/api.php/event`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(eventData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Handle both array and single object responses
    // The API returns an array with the new event as the first item
    console.log('Create event API response:', data);
    
    const event = Array.isArray(data) ? data[0] : data;
    
    // FIXED: Convert string coordinates to numbers for the returned event
    return {
      ...event,
      location_latitude: event.location_latitude ? Number(event.location_latitude) : 0,
      location_longitude: event.location_longitude ? Number(event.location_longitude) : 0,
      popularity_score: event.popularity_score ? Number(event.popularity_score) : 0,
      max_attendees: event.max_attendees ? Number(event.max_attendees) : 0,
    };
  },

  async updateEvent(eventId: number, eventData: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string;
    location_name?: string;
    location_latitude?: number;
    location_longitude?: number;
    start_datetime?: string;
    end_datetime?: string;
    max_attendees?: number;
    status?: string;
    images?: string;
    videos?: string;
    popularity_score?: number;
  }) {
    const response = await fetch(`${EVENTS_API}/api.php/event/${eventId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(eventData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string coordinates to numbers for the returned event
    return {
      ...data,
      location_latitude: data.location_latitude ? Number(data.location_latitude) : 0,
      location_longitude: data.location_longitude ? Number(data.location_longitude) : 0,
      popularity_score: data.popularity_score ? Number(data.popularity_score) : 0,
      max_attendees: data.max_attendees ? Number(data.max_attendees) : 0,
    };
  },

  async createTicketType(ticketData: {
    event_id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    refundable: boolean;
  }) {
    const response = await fetch(`${EVENTS_API}/api.php/ticket_type`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(ticketData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string prices to numbers for the returned ticket type
    return {
      ...data,
      price: data.price ? Number(data.price) : 0,
      quantity: data.quantity ? Number(data.quantity) : 0,
      quantity_sold: data.quantity_sold ? Number(data.quantity_sold) : 0,
    };
  },

  async updateTicketType(ticketTypeId: number, ticketData: {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    refundable?: boolean;
  }) {
    const response = await fetch(`${EVENTS_API}/api.php/ticket_type/${ticketTypeId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(ticketData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string prices to numbers for the returned ticket type
    return {
      ...data,
      price: data.price ? Number(data.price) : 0,
      quantity: data.quantity ? Number(data.quantity) : 0,
      quantity_sold: data.quantity_sold ? Number(data.quantity_sold) : 0,
    };
  },

  async createComment(commentData: {
    event_id: number;
    user_id: number;
    content: string;
    parent_comment_id?: number;
  }) {
    const response = await fetch(`${EVENTS_API}/api.php/comment`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(commentData),
    });

    const data = await handleApiResponse(response);
    
    // FIXED: Convert string numbers to actual numbers for the returned comment
    return {
      ...data,
      likes: data.likes ? Number(data.likes) : 0,
      event_id: Number(data.event_id),
      user_id: Number(data.user_id),
      parent_comment_id: data.parent_comment_id ? Number(data.parent_comment_id) : null,
    };
  },
};