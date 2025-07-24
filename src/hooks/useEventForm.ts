import React, { useState } from 'react';

export interface EventFormData {
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
  videos: string;
  status?: string;
}

export interface TicketTypeForm {
  id: string | number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  refundable: boolean;
  isNew?: boolean;
}

export const useEventForm = (initialData?: Partial<EventFormData>, initialTicketTypes?: TicketTypeForm[]) => {
  // Helper function to get default start date (today + 7 days, rounded to current hour)
  const getDefaultStartDate = () => {
    const now = new Date();
    const defaultDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // Add 7 days
    defaultDate.setMinutes(0, 0, 0); // Round to current hour
    return defaultDate.toISOString().slice(0, 16); // Format for datetime-local input
  };

  // Helper function to get default end date (start date + 1 hour)
  const getDefaultEndDate = (startDateTime: string) => {
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // Add 1 hour
    return endDate.toISOString().slice(0, 16);
  };

  const [eventData, setEventData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    tags: '',
    location_name: '',
    location_latitude: 0,
    location_longitude: 0,
    start_datetime: initialData?.start_datetime || getDefaultStartDate(),
    end_datetime: initialData?.end_datetime || '',
    max_attendees: 0,
    videos: '',
    status: 'active',
    ...initialData,
  });

  // Set default end date if not provided in initial data
  React.useEffect(() => {
    if (!initialData?.end_datetime && eventData.start_datetime && !eventData.end_datetime) {
      setEventData(prev => ({
        ...prev,
        end_datetime: getDefaultEndDate(prev.start_datetime),
      }));
    }
  }, [initialData?.end_datetime, eventData.start_datetime, eventData.end_datetime]);

  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>(
    initialTicketTypes || [
      {
        id: '1',
        name: 'General Admission',
        description: '',
        price: 0,
        quantity: 50,
        refundable: false,
      }
    ]
  );

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setEventData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      };
      
      // Auto-update end date when start date changes
      if (name === 'start_datetime' && value) {
        const newStartDate = new Date(value);
        const currentEndDate = prev.end_datetime ? new Date(prev.end_datetime) : null;
        const suggestedEndDate = new Date(newStartDate.getTime() + (60 * 60 * 1000)); // Start + 1 hour
        
        // Only update end date if it's empty or if the current end date is before the suggested end date
        if (!currentEndDate || currentEndDate <= suggestedEndDate) {
          newData.end_datetime = suggestedEndDate.toISOString().slice(0, 16);
        }
      }
      
      return newData;
    });
  };

  const handleTicketTypeChange = (id: string | number, field: keyof TicketTypeForm, value: string | number | boolean) => {
    setTicketTypes(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ));
  };

  const addTicketType = () => {
    const newTicketType: TicketTypeForm = {
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      quantity: 50,
      refundable: false,
      isNew: true,
    };
    setTicketTypes(prev => [...prev, newTicketType]);
  };

  const removeTicketType = (id: string | number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(prev => prev.filter(ticket => ticket.id !== id));
    }
  };

  const handleLocationSelect = (location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    setEventData(prev => ({
      ...prev,
      location_name: location.name,
      location_latitude: location.latitude,
      location_longitude: location.longitude,
    }));
  };

  const validateForm = (isFreeEvent: boolean = false): string | null => {
    if (!eventData.title.trim()) return 'Event title is required';
    if (!eventData.description.trim()) return 'Event description is required';
    if (!eventData.category) return 'Event category is required';
    if (!eventData.location_name.trim()) return 'Event location is required';
    if (!eventData.start_datetime) return 'Start date and time is required';
    if (!eventData.end_datetime) return 'End date and time is required';
    
    const startDate = new Date(eventData.start_datetime);
    const endDate = new Date(eventData.end_datetime);
    if (endDate <= startDate) return 'End date must be after start date';
    
    if (eventData.max_attendees <= 0) return 'Maximum attendees must be greater than 0';

    // Validate ticket types (only if not a free event or if ticket types exist)
    if (!isFreeEvent || ticketTypes.length > 0) {
      for (const ticket of ticketTypes) {
        if (!ticket.name.trim()) return 'All ticket types must have a name';
        if (ticket.quantity <= 0) return 'All ticket types must have a quantity greater than 0';
        if (ticket.price < 0) return 'Ticket prices cannot be negative';
      }
    }

    // Check if event has ticket types or is marked as free
    if (ticketTypes.length === 0 && !isFreeEvent) {
      return 'Please add ticket types or mark the event as free';
    }

    return null;
  };

  return {
    eventData,
    setEventData,
    ticketTypes,
    setTicketTypes,
    handleEventChange,
    handleTicketTypeChange,
    addTicketType,
    removeTicketType,
    handleLocationSelect,
    validateForm,
  };
};