import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, MessageCircle, Heart } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useUser } from '../hooks/useUser';
import { Event } from '../types/event.types';
import { formatTime, getDateParts } from '../utils/dateUtils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { 
    isPastEvent, 
    getAverageRating, 
    getEventReviews, 
    getEventComments, 
    getEventFavoriteCount,
    isEventFavorited
  } = useEvents();
  const { user } = useUser();
  
  const isPast = isPastEvent(event);
  const averageRating = getAverageRating(event.id);
  const reviewCount = getEventReviews(event.id).length;
  const commentCount = getEventComments(event.id).length;
  const favoriteCount = getEventFavoriteCount(event.id);
  const isFavorited = user ? isEventFavorited(event.id, user.id) : false;

  const availableSpots = event.maxParticipants - event.sold;
  const isAlmostFull = availableSpots <= event.maxParticipants * 0.1;
  const isSoldOut = availableSpots <= 0;

  const dateParts = getDateParts(event.date);

  return (
    <Link
      to={`/event/${event.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Event Image */}
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {dateParts.day}
              </div>
              <div className="text-sm text-gray-600">
                {dateParts.month} {dateParts.weekday}
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay with date for images */}
        {event.image && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <div className="text-lg font-bold text-blue-600 text-center">
              {dateParts.day}
            </div>
            <div className="text-xs text-gray-600 text-center">
              {dateParts.month}
            </div>
            <div className="text-xs text-gray-500 text-center">
              {dateParts.weekday}
            </div>
          </div>
        )}

        {/* Category badge and favorite indicator */}
        <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {event.category}
          </div>
          
          {/* User's favorite indicator */}
          {user && isFavorited && (
            <div className="bg-pink-500 bg-opacity-90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Heart className="h-4 w-4 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Engagement stats */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-3">
          {favoriteCount > 0 && (
            <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1">
              <Heart className="h-3 w-3 text-pink-500 fill-current mr-1" />
              <span className="text-xs font-medium text-gray-700">{favoriteCount}</span>
            </div>
          )}
          {commentCount > 0 && (
            <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1">
              <MessageCircle className="h-3 w-3 text-blue-500 mr-1" />
              <span className="text-xs font-medium text-gray-700">{commentCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
          {isPast && reviewCount > 0 && (
            <div className="flex items-center space-x-1 text-sm text-amber-600 ml-2">
              <Star className="h-4 w-4 fill-current" />
              <span>{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({reviewCount})</span>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span>{event.sold} / {event.maxParticipants} attending</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{event.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {event.price === 0 ? (
              <span className="text-yellow-600">Free</span>
            ) : (
              `R${event.price}`
            )}
          </div>
          <div className="text-sm">
            {isSoldOut ? (
              <span className="text-red-600 font-medium">Sold Out</span>
            ) : isAlmostFull ? (
              <span className="text-pink-600 font-medium">Almost Full</span>
            ) : isPast ? (
              <span className="text-gray-500">Past Event</span>
            ) : (
              <span className="text-yellow-600 font-medium">{availableSpots} spots left</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}