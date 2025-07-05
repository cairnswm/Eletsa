import React from 'react';
import { Calendar, MapPin, Users, Clock, Tag, Map } from 'lucide-react';

interface EventFormData {
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

interface EventFormFieldsProps {
  eventData: EventFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onLocationPickerOpen: () => void;
  showStatus?: boolean;
}

const categories = [
  'Workshop', 'Social', 'Sports', 'Music', 'Food', 'Business', 'Arts', 'Technology', 'Health', 'Education'
];

export const EventFormFields: React.FC<EventFormFieldsProps> = ({
  eventData,
  onChange,
  onLocationPickerOpen,
  showStatus = false,
}) => {
  return (
    <>
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
              onChange={onChange}
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
              onChange={onChange}
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

          {/* Status (only for edit) */}
          {showStatus && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={eventData.status || 'active'}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Tags */}
          <div className={showStatus ? "lg:col-span-2" : ""}>
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
                onChange={onChange}
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
              onChange={onChange}
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
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  placeholder="Enter venue name and address"
                />
              </div>
              <button
                type="button"
                onClick={onLocationPickerOpen}
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
                onChange={onChange}
                min={showStatus ? undefined : new Date().toISOString().slice(0, 16)}
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
                onChange={onChange}
                min={eventData.start_datetime || (showStatus ? undefined : new Date().toISOString().slice(0, 16))}
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
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                placeholder="50"
              />
            </div>
          </div>

          {/* Videos */}
          <div>
            <label htmlFor="videos" className="block text-sm font-medium text-gray-700 mb-2">
              Event Videos
            </label>
            <input
              id="videos"
              name="videos"
              type="url"
              value={eventData.videos}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-500">Enter video URL or JSON array of URLs</p>
          </div>
        </div>
      </div>
    </>
  );
};