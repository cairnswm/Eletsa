import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useEvents } from '../hooks/useEvents';
import { useTransactions } from '../hooks/useTransactions';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  MessageCircle, 
  Edit,
  Eye,
  BarChart3,
  DollarSign,
  X,
  Settings
} from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateUtils';

export function MyEvents() {
  const { user } = useUser();
  const { events, isPastEvent, getAverageRating, getEventReviews, getEventComments } = useEvents();
  const { getEventTransactions } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Check if user has permission to manage events
  const canManageEvents = user && (user.role === 'organizer' || user.role === 'admin');

  if (!canManageEvents) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be an organizer or admin to access this page.</p>
          <Link
            to="/discover"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Discover Events
          </Link>
        </div>
      </div>
    );
  }

  // Get events based on user role
  const userEvents = useMemo(() => {
    if (user.role === 'admin') {
      return events; // Admins can see all events
    } else {
      return events.filter(event => event.organizerId === user.id);
    }
  }, [events, user]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = userEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !selectedLocation || event.location === selectedLocation;
      const matchesPastFilter = showPastEvents ? isPastEvent(event) : !isPastEvent(event);
      
      return matchesSearch && matchesLocation && matchesPastFilter;
    });

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [userEvents, searchTerm, selectedLocation, showPastEvents, isPastEvent]);

  // Get unique locations
  const locations = [...new Set(userEvents.map(event => event.location))].sort();

  // Calculate stats
  const upcomingEvents = userEvents.filter(event => !isPastEvent(event));
  const pastEvents = userEvents.filter(event => isPastEvent(event));
  
  // Calculate total revenue from transactions
  const totalRevenue = userEvents.reduce((sum, event) => {
    const eventTransactions = getEventTransactions(event.id);
    const salesTransactions = eventTransactions.filter(t => t.type === 'sale');
    return sum + salesTransactions.reduce((eventSum, t) => eventSum + t.netAmount, 0);
  }, 0);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
  };

  const hasActiveFilters = searchTerm || selectedLocation;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.role === 'admin' ? 'All Events' : 'My Events'}
            </h1>
            <p className="text-gray-600">
              {user.role === 'admin' 
                ? 'Manage all events on the platform' 
                : 'Manage your events and track performance'
              }
            </p>
          </div>
          
          <Link
            to="/event/new"
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{userEvents.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Events</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{upcomingEvents.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{pastEvents.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">R{totalRevenue}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t border-gray-200`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={showPastEvents ? 'past' : 'upcoming'}
                  onChange={(e) => setShowPastEvents(e.target.value === 'past')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="upcoming">Upcoming Events</option>
                  <option value="past">Past Events</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredEvents.length} {showPastEvents ? 'past' : 'upcoming'} event{filteredEvents.length !== 1 ? 's' : ''} found
            {hasActiveFilters && (
              <span className="ml-2 text-sm text-blue-600">
                (filtered)
              </span>
            )}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map(event => {
              const isPast = isPastEvent(event);
              const averageRating = getAverageRating(event.id);
              const reviewCount = getEventReviews(event.id).length;
              const commentCount = getEventComments(event.id).length;
              const eventTransactions = getEventTransactions(event.id);
              const salesTransactions = eventTransactions.filter(t => t.type === 'sale');
              const eventRevenue = salesTransactions.reduce((sum, t) => sum + t.netAmount, 0);
              const availableSpots = event.maxParticipants - event.sold;
              const isSoldOut = availableSpots <= 0;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Event Image */}
                  <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isPast 
                          ? 'bg-gray-100 text-gray-700' 
                          : isSoldOut
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {isPast ? 'Completed' : isSoldOut ? 'Sold Out' : 'Active'}
                      </span>
                    </div>

                    {/* Engagement Stats */}
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                      {commentCount > 0 && (
                        <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1">
                          <MessageCircle className="h-3 w-3 text-blue-500 mr-1" />
                          <span className="text-xs font-medium text-gray-700">{commentCount}</span>
                        </div>
                      )}
                      {isPast && reviewCount > 0 && (
                        <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="h-3 w-3 text-amber-500 fill-current mr-1" />
                          <span className="text-xs font-medium text-gray-700">{averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {event.title}
                      </h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="truncate">{formatDate(event.date)} at {formatTime(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{event.sold} / {event.maxParticipants} attending</span>
                      </div>
                    </div>

                    {/* Revenue and Stats */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Revenue:</span>
                          <div className="font-semibold text-gray-900">R{eventRevenue}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Tickets:</span>
                          <div className="font-semibold text-gray-900">{salesTransactions.length}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/event/${event.id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                      <Link
                        to={`/event/${event.id}/edit`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {showPastEvents ? 'past' : 'upcoming'} events found
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria.'
                : showPastEvents 
                ? 'You haven\'t organized any events yet.'
                : 'Create your first event to get started.'
              }
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
              >
                Clear All Filters
              </button>
            ) : (
              <Link
                to="/event/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Event
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}