import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Save, AlertCircle, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { useEvent } from '../contexts/EventContext';
import { eventsApi } from '../services/events';
import { LocationPicker } from '../components/location/LocationPicker';
import { useImageUpload } from '../hooks/useImageUpload';
import { useEventForm } from '../hooks/useEventForm';
import { EventFormFields } from '../components/forms/EventFormFields';
import { EventImageSection } from '../components/forms/EventImageSection';
import { TicketTypesSection } from '../components/forms/TicketTypesSection';

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrganizerByUserId, refreshOrganizerEvents } = useOrganizer();
  const { fetchEvents } = useEvent();
  const { uploadImages, uploading: imageUploading } = useImageUpload();
  
  // Get organizer data
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [isFreeEvent, setIsFreeEvent] = useState(false);

  // Use the event form hook
  const {
    eventData,
    ticketTypes,
    handleEventChange,
    handleTicketTypeChange,
    addTicketType,
    removeTicketType,
    handleLocationSelect,
    validateForm,
  } = useEventForm();

  // Check if event has valid ticket types or is marked as free
  const hasValidTicketTypes = ticketTypes.some(ticket => 
    ticket.name.trim() && ticket.quantity > 0 && ticket.price >= 0
  );
  
  const canSubmit = hasValidTicketTypes || isFreeEvent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userOrganizer || !user) {
      setError('You must be an organizer to create events');
      return;
    }

    const validationError = validateForm(isFreeEvent);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let imageUrls: string[] = [];
      
      // Upload images first if any are selected
      if (selectedImageFiles.length > 0) {
        console.log('Uploading images before creating event...');
        try {
          imageUrls = await uploadImages(selectedImageFiles);
          console.log('Images uploaded successfully:', imageUrls);
        } catch (uploadError) {
          setError('Failed to upload images. Please try again.');
          console.error('Image upload failed:', uploadError);
          return;
        }
      }

      console.log('Creating event with user ID as organizer_id:', user.id);

      // Create the event
      const eventResponse = await eventsApi.createEvent({
        organizer_id: user.id,
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        category: eventData.category,
        tags: eventData.tags.trim(),
        location_name: eventData.location_name.trim(),
        location_latitude: eventData.location_latitude,
        location_longitude: eventData.location_longitude,
        start_datetime: eventData.start_datetime,
        end_datetime: eventData.end_datetime,
        max_attendees: eventData.max_attendees,
        status: 'active',
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : '',
        videos: eventData.videos.trim(),
      });

      const newEvent = Array.isArray(eventResponse) ? eventResponse[0] : eventResponse;
      const eventId = newEvent.id;

      console.log('Created event:', newEvent);

      // Create ticket types for the event
      if (isFreeEvent && ticketTypes.length === 0) {
        // Create a default free ticket type
        await eventsApi.createTicketType({
          event_id: eventId,
          name: 'Free Entry',
          description: 'Free admission to this event',
          price: 0,
          quantity: eventData.max_attendees,
          refundable: false,
        });
      } else {
        // Create the specified ticket types
        for (const ticketType of ticketTypes) {
          await eventsApi.createTicketType({
            event_id: eventId,
            name: ticketType.name.trim(),
            description: ticketType.description.trim(),
            price: ticketType.price,
            quantity: ticketType.quantity,
            refundable: ticketType.refundable,
          });
        }
      }

      console.log('All ticket types created successfully');

      // Refresh both caches
      await refreshOrganizerEvents(user.id);
      await fetchEvents();
      
      // Navigate to my events page
      navigate('/my-events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Failed to create event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!userOrganizer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer Access Required</h2>
          <p className="text-gray-600 mb-6">You need to be an event organizer to create events.</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
          >
            Become an Organizer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/my-events')}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#1E30FF] transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to My Events</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
            Create New Event
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in the details below to create your amazing event
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Form Fields */}
          <EventFormFields
            eventData={eventData}
            onChange={handleEventChange}
            onLocationPickerOpen={() => setShowLocationPicker(true)}
          />

          {/* Image Section */}
          <EventImageSection
            selectedImageFiles={selectedImageFiles}
            onFilesChange={setSelectedImageFiles}
          />

          {/* Ticket Types */}
          <TicketTypesSection
            ticketTypes={ticketTypes}
            isFreeEvent={isFreeEvent}
            onFreeEventChange={setIsFreeEvent}
            onTicketTypeChange={handleTicketTypeChange}
            onAddTicketType={addTicketType}
            onRemoveTicketType={removeTicketType}
          />

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-events')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageUploading || !canSubmit}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                canSubmit 
                  ? 'bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white hover:opacity-90' 
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              <Save className="w-5 h-5" />
              <span>
                {imageUploading ? 'Uploading Images...' : loading ? 'Creating Event...' : 'Create Event'}
              </span>
            </button>
            {!canSubmit && (
              <p className="text-xs text-gray-500 mt-2 text-right">
                Add ticket types or mark as free event to enable creation
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={
          eventData.location_latitude !== 0 && eventData.location_longitude !== 0
            ? {
                name: eventData.location_name,
                latitude: eventData.location_latitude,
                longitude: eventData.location_longitude,
              }
            : undefined
        }
      />
    </div>
  );
};