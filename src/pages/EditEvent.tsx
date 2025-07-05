import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { useEvent } from '../contexts/EventContext';
import { eventsApi } from '../services/events';
import { LocationPicker } from '../components/location/LocationPicker';
import { useImageUpload } from '../hooks/useImageUpload';
import { useEventForm, EventFormData, TicketTypeForm } from '../hooks/useEventForm';
import { EventFormFields } from '../components/forms/EventFormFields';
import { EventImageSection } from '../components/forms/EventImageSection';
import { TicketTypesSection } from '../components/forms/TicketTypesSection';

export const EditEvent: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { getOrganizerByUserId, getOrganizerEvents } = useOrganizer();
  const { getEventTicketTypes, setActiveEventId, fetchEventTicketTypes, invalidateEventTicketTypes } = useEvent();
  const { uploadImages, uploading: imageUploading } = useImageUpload();
  
  // Get organizer data
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Initialize the form hook with empty data first
  const {
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
  } = useEventForm();

  // Load event data from context
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId || !userOrganizer || !user) return;

      try {
        setInitialLoading(true);
        setError(null);

        // Get event from organizer events context
        const organizerEvents = getOrganizerEvents(user.id);
        const event = organizerEvents.find(e => e.id === parseInt(eventId));

        if (!event) {
          setError('Event not found. Please make sure you have access to this event.');
          return;
        }

        // Check if user owns this event
        if (event.organizer_id !== user.id) {
          setError('You do not have permission to edit this event');
          return;
        }

        console.log('Loading event data for editing:', event);

        // FIXED: Set this event as the active event to trigger ticket type fetching
        await setActiveEventId(parseInt(eventId));

        // Set event data
        const formData: EventFormData = {
          title: event.title,
          description: event.description,
          category: event.category,
          tags: event.tags || '',
          location_name: event.location_name,
          location_latitude: event.location_latitude,
          location_longitude: event.location_longitude,
          start_datetime: event.start_datetime.slice(0, 16),
          end_datetime: event.end_datetime.slice(0, 16),
          max_attendees: event.max_attendees,
          videos: event.videos || '',
          status: event.status || 'active',
        };
        setEventData(formData);

        // Parse existing images
        if (event.images) {
          try {
            const images = JSON.parse(event.images);
            if (Array.isArray(images)) {
              setExistingImages(images);
            } else if (typeof images === 'string' && images.trim()) {
              setExistingImages([images]);
            }
          } catch (e) {
            if (event.images.trim()) {
              setExistingImages([event.images]);
            }
          }
        }

        // FIXED: Wait a bit for the active event to be set and ticket types to be fetched
        setTimeout(() => {
          const cachedTicketTypes = getEventTicketTypes(parseInt(eventId));
          
          if (cachedTicketTypes.length > 0) {
            console.log('Using fetched ticket types:', cachedTicketTypes);
            const formattedTicketTypes: TicketTypeForm[] = cachedTicketTypes.map(tt => ({
              id: tt.id,
              name: tt.name,
              description: tt.description,
              price: tt.price,
              quantity: tt.quantity,
              refundable: tt.refundable,
              isNew: false,
            }));
            setTicketTypes(formattedTicketTypes);
          } else {
            console.log('No ticket types found, setting default');
            setTicketTypes([{
              id: 'default-1',
              name: 'General Admission',
              description: '',
              price: 0,
              quantity: 50,
              refundable: false,
              isNew: true,
            }]);
          }
        }, 500);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event data');
        console.error('Failed to load event data:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    loadEventData();
  }, [eventId, userOrganizer?.id, user?.id, getOrganizerEvents, getEventTicketTypes, setActiveEventId, setEventData, setTicketTypes]);

  const removeExistingImage = (index: number) => {
    const newImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userOrganizer || !eventId || !user) {
      setError('Invalid event or organizer');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let finalImageUrls = [...existingImages];
      
      // Upload new images if any are selected
      if (selectedImageFiles.length > 0) {
        console.log('Uploading new images...');
        try {
          const newImageUrls = await uploadImages(selectedImageFiles);
          console.log('New images uploaded successfully:', newImageUrls);
          finalImageUrls = [...finalImageUrls, ...newImageUrls];
        } catch (uploadError) {
          setError('Failed to upload images. Please try again.');
          console.error('Image upload failed:', uploadError);
          return;
        }
      }

      console.log('Updating event with data:', eventData);

      // Update the event
      await eventsApi.updateEvent(parseInt(eventId), {
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
        status: eventData.status,
        images: finalImageUrls.length > 0 ? JSON.stringify(finalImageUrls) : '',
        videos: eventData.videos.trim(),
      });

      console.log('Event updated successfully');
      
      // FIXED: Handle ticket type updates
      console.log('Processing ticket type updates...');
      
      // Create new ticket types (those with string IDs starting with 'new-')
      const newTicketTypes = ticketTypes.filter(tt => typeof tt.id === 'string' && tt.id.startsWith('new-'));
      for (const ticketType of newTicketTypes) {
        console.log('Creating new ticket type:', ticketType);
        await eventsApi.createTicketType({
          event_id: parseInt(eventId),
          name: ticketType.name.trim(),
          description: ticketType.description.trim(),
          price: ticketType.price,
          quantity: ticketType.quantity,
          refundable: ticketType.refundable,
        });
      }
      
      // Update existing ticket types (those with numeric IDs)
      const existingTicketTypes = ticketTypes.filter(tt => typeof tt.id === 'number');
      for (const ticketType of existingTicketTypes) {
        console.log('Updating existing ticket type:', ticketType);
        await eventsApi.updateTicketType(ticketType.id as number, {
          name: ticketType.name.trim(),
          description: ticketType.description.trim(),
          price: ticketType.price,
          quantity: ticketType.quantity,
          refundable: ticketType.refundable,
        });
      }
      
      console.log('All ticket types processed successfully');
      
      // FIXED: Invalidate ticket types cache to force refresh on next load
      invalidateEventTicketTypes(parseInt(eventId));
      
      // FIXED: Clear the active event when navigating away
      setActiveEventId(null);
      
      // Navigate back to my events page
      navigate('/my-events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Failed to update event:', err);
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
          <p className="text-gray-600 mb-6">You need to be an event organizer to edit events.</p>
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
          <span className="text-gray-600">Loading event data...</span>
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
            Edit Event
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Update your event details and settings
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
            showStatus={true}
          />

          {/* Image Section */}
          <EventImageSection
            selectedImageFiles={selectedImageFiles}
            onFilesChange={setSelectedImageFiles}
            existingImages={existingImages}
            onRemoveExistingImage={removeExistingImage}
            isEdit={true}
          />

          {/* Ticket Types */}
          <TicketTypesSection
            ticketTypes={ticketTypes}
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
              disabled={loading || imageUploading}
              className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>
                {imageUploading ? 'Uploading Images...' : loading ? 'Updating Event...' : 'Update Event'}
              </span>
            </button>
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