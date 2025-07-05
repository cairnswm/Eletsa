import React from 'react';
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import { Event } from '../../types/event';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventImage = () => {
    if (event.images) {
      try {
        const images = JSON.parse(event.images);
        if (Array.isArray(images) && images.length > 0) {
          return images[0];
        }
      } catch (e) {
        // If parsing fails, treat as single image URL
        return event.images;
      }
    }
    // Default event image from Pexels
    return 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1';
  };

  const availableSpots = event.max_attendees > 0 ? event.max_attendees : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getEventImage()}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="text-sm font-bold text-gray-900">{formatDate(event.start_datetime)}</div>
            <div className="text-xs text-gray-600">{formatTime(event.start_datetime)}</div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-2 py-1 rounded-full text-xs font-medium">
            {event.category}
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1E30FF] transition-colors duration-200">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-[#FF2D95]" />
            <span className="truncate">{event.location_name}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-[#489707]" />
            <span>
              {formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}
            </span>
          </div>

          {availableSpots && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-[#f0900a]" />
              <span>{availableSpots} spots available</span>
            </div>
          )}
        </div>

        {/* Event Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {event.popularity_score ? event.popularity_score.toFixed(1) : '4.5'}
            </span>
          </div>
          
          {event.tags && (
            <div className="flex flex-wrap gap-1">
              {event.tags.split(',').slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};