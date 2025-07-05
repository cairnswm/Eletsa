import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Image, Tag, Plus, Trash2, Save, AlertCircle, DollarSign, RefreshCw, Map } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { useEvent } from '../contexts/EventContext';
import { eventsApi } from '../services/events';
import { LocationPicker } from '../components/location/LocationPicker';
import { ImageUpload } from '../components/common/ImageUpload';
import { useImageUpload } from '../hooks/useImageUpload';

interface TicketTypeForm {
  id: string; // temporary ID for form management
  name: string;
  description: string;
  price: number;
  quantity: number;
  refundable: boolean;
}

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrganizerByUserId, refreshOrganizerEvents } = useOrganizer();
  const { fetchEvents } = useEvent(); // Re-add this to refresh main events list
  const { uploadImages, uploading: imageUploading } = useImageUpload();
  
  // Get organizer data
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);

  // Event form data
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    location_name: '',
    location_latitude: 0,
    location_longitude: 0,
    start_datetime: '',
    end_datetime: '',
    max_attendees: 0,
    videos: '',
  });

  // Ticket types (must have at least one)
  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([
    {
      id: '1',
      name: 'General Admission',
      description: '',
      price: 0,
      quantity: 50,
      refundable: false,
    }
  ]);

  const categories = [
    'Workshop', 'Social', 'Sports', 'Music', 'Food', 'Business', 'Arts', 'Technology', 'Health', 'Education'
  ];

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTicketTypeChange = (id: string, field: keyof TicketTypeForm, value: string | number | boolean) => {
    setTicketTypes(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ));
  };

  const addTicketType = () => {
    const newTicketType: TicketTypeForm = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      quantity: 50,
      refundable: false,
    };
    setTicketTypes(prev => [...prev, newTicketType]);
  };

  const removeTicketType = (id: string) => {
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

  const validateForm = (): string | null => {
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

    // Validate ticket types
    for (const ticket of ticketTypes) {
      if (!ticket.name.trim()) return 'All ticket types must have a name';
      if (ticket.quantity <= 0) return 'All ticket types must have a quantity greater than 0';
      if (ticket.price < 0) return 'Ticket prices cannot be negative';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userOrganizer || !user) {
      setError('You must be an organizer to create events');
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

      // FIXED: Use user.id as organizer_id since organizer_id field links to user table
      // FIXED: Set status to 'active' explicitly to avoid empty status
      const eventResponse = await eventsApi.createEvent({
        organizer_id: user.id, // Use user.id instead of userOrganizer.id
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
        status: 'active', // FIXED: Explicitly set status to 'active'
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : '',
        videos: eventData.videos.trim(),
      });

      // FIXED: Handle array response properly
      // The API returns an array with the new event as the first item
      const newEvent = Array.isArray(eventResponse) ? eventResponse[0] : eventResponse;
      const eventId = newEvent.id;

      console.log('Created event:', newEvent);
      console.log('Event ID for ticket types:', eventId);

      // Create ticket types for the event using the correct event ID
      for (const ticketType of ticketTypes) {
        console.log('Creating ticket type:', {
          event_id: eventId,
          name: ticketType.name.trim(),
          description: ticketType.description.trim(),
          price: ticketType.price,
          quantity: ticketType.quantity,
          refundable: ticketType.refundable,
        });

        await eventsApi.createTicketType({
          event_id: eventId,
          name: ticketType.name.trim(),
          description: ticketType.description.trim(),
          price: ticketType.price,
          quantity: ticketType.quantity,
          refundable: ticketType.refundable,
        });
      }

      console.log('All ticket types created successfully');

      // FIXED: Refresh both caches to show the new event immediately
      console.log('Refreshing event caches...');
      
      // Refresh organizer events using user.id
      await refreshOrganizerEvents(user.id);
      
      // Refresh main events list so it appears on home page too
      await fetchEvents();
      
      console.log('Event caches refreshed successfully');

      // Navigate to my events page
      navigate('/my-events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Failed to create event:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
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

        {/* Debug Info - Remove in production */}
        {/* {process.env.NODE_ENV === 'development' && userOrganizer && user && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Debug Info:</strong> User ID: {user.id}, Organizer ID: {userOrganizer.id}
              <br />
              <strong>Note:</strong> Using User ID ({user.id}) as organizer_id since organizer_id field links to user table
              <br />
              <strong>Status:</strong> Will be set to 'active' to ensure proper categorization  
            </p>
          </div>
        )} */}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-[#1E30FF]" />
              <span>Basic Information</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="lg:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={eventData.title}
                  onChange={handleEventChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your event title"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={eventData.category}
                  onChange={handleEventChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={eventData.tags}
                    onChange={handleEventChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                    placeholder="e.g., networking, beginner-friendly, outdoor"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={eventData.description}
                  onChange={handleEventChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe your event in detail..."
                />
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-[#FF2D95]" />
              <span>Location & Time</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location */}
              <div className="lg:col-span-2">
                <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location *
                </label>
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="location_name"
                      name="location_name"
                      type="text"
                      required
                      value={eventData.location_name}
                      onChange={handleEventChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                      placeholder="Enter venue name and address"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(true)}
                    className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white rounded-lg hover:opacity-90 transition-all duration-200"
                  >
                    <Map className="w-4 h-4" />
                    <span className="hidden sm:inline">Select on Map</span>
                  </button>
                </div>
                {eventData.location_latitude !== 0 && eventData.location_longitude !== 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Coordinates: {eventData.location_latitude.toFixed(6)}, {eventData.location_longitude.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Start Date & Time */}
              <div>
                <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="start_datetime"
                    name="start_datetime"
                    type="datetime-local"
                    required
                    value={eventData.start_datetime}
                    onChange={handleEventChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div>
                <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="end_datetime"
                    name="end_datetime"
                    type="datetime-local"
                    required
                    value={eventData.end_datetime}
                    onChange={handleEventChange}
                    min={eventData.start_datetime || new Date().toISOString().slice(0, 16)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Max Attendees */}
              <div>
                <label htmlFor="max_attendees" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attendees *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="max_attendees"
                    name="max_attendees"
                    type="number"
                    required
                    min="1"
                    value={eventData.max_attendees || ''}
                    onChange={handleEventChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Image className="w-6 h-6 text-[#489707]" />
              <span>Media</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Images */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Images
                </label>
                <ImageUpload
                  onFilesChange={setSelectedImageFiles}
                  maxImages={5}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">Select up to 5 images for your event. Images will be uploaded when you save the event. Large images will be automatically resized.</p>
              </div>

              {/* Videos */}
              <div className="lg:col-span-2">
                <label htmlFor="videos" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Videos
                </label>
                <input
                  id="videos"
                  name="videos"
                  type="url"
                  value={eventData.videos}
                  onChange={handleEventChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="mt-1 text-xs text-gray-500">Enter video URL or JSON array of URLs</p>
              </div>
            </div>
          </div>

          {/* Ticket Types */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-[#f0900a]" />
                <span>Ticket Types</span>
              </h2>
              <button
                type="button"
                onClick={addTicketType}
                className="bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ticket Type</span>
              </button>
            </div>

            <div className="space-y-6">
              {ticketTypes.map((ticket, index) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ticket Type {index + 1}
                    </h3>
                    {ticketTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketType(ticket.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Ticket Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={ticket.name}
                        onChange={(e) => handleTicketTypeChange(ticket.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                        placeholder="e.g., General Admission, VIP, Early Bird"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (ZAR) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={ticket.price}
                          onChange={(e) => handleTicketTypeChange(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                      {ticket.price > 0 && (
                        <p className="mt-1 text-xs text-gray-600">
                          Price: {formatCurrency(ticket.price)}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={ticket.quantity}
                        onChange={(e) => handleTicketTypeChange(ticket.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                        placeholder="50"
                      />
                    </div>

                    {/* Refundable */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`refundable-${ticket.id}`}
                        checked={ticket.refundable}
                        onChange={(e) => handleTicketTypeChange(ticket.id, 'refundable', e.target.checked)}
                        className="w-4 h-4 text-[#1E30FF] border-gray-300 rounded focus:ring-[#1E30FF]"
                      />
                      <label htmlFor={`refundable-${ticket.id}`} className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <RefreshCw className="w-4 h-4" />
                        <span>Refundable</span>
                      </label>
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={ticket.description}
                        onChange={(e) => handleTicketTypeChange(ticket.id, 'description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Optional description for this ticket type"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                {imageUploading ? 'Uploading Images...' : loading ? 'Creating Event...' : 'Create Event'}
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