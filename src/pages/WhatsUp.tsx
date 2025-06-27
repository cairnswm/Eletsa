import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useEvents } from '../hooks/useEvents';
import { FollowButton } from '../components/FollowButton';
import { 
  Heart, 
  Star, 
  Ticket, 
  Calendar, 
  MapPin, 
  User,
  TrendingUp,
  Users,
  Search,
  X
} from 'lucide-react';
import { formatEventDate, formatEventTime } from '../utils/dateUtils';

interface Activity {
  id: string;
  type: 'favorite' | 'ticket' | 'review';
  userId: number;
  userName: string;
  userRole: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage?: string;
  timestamp: string;
  rating?: number;
  comment?: string;
  ticketQuantity?: number;
}

export function WhatsUp() {
  const { user, getFollowing } = useUser();
  const { events, favorites, tickets, reviews } = useEvents();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'tickets' | 'reviews'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      generateActivities();
    }
  }, [user, favorites, tickets, reviews]);

  const generateActivities = () => {
    if (!user) return;

    const following = getFollowing(user.id);
    const followingIds = following.map(u => u.id);
    const allActivities: Activity[] = [];

    // Get favorite activities
    favorites.forEach(favorite => {
      if (followingIds.includes(favorite.userId)) {
        const event = events.find(e => e.id === favorite.eventId);
        const followedUser = following.find(u => u.id === favorite.userId);
        
        if (event && followedUser) {
          allActivities.push({
            id: `favorite-${favorite.id}`,
            type: 'favorite',
            userId: favorite.userId,
            userName: followedUser.name,
            userRole: followedUser.role,
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventLocation: event.location,
            eventImage: event.image,
            timestamp: favorite.timestamp
          });
        }
      }
    });

    // Get ticket purchase activities
    tickets.forEach(ticket => {
      if (followingIds.includes(ticket.userId)) {
        const event = events.find(e => e.id === ticket.eventId);
        const followedUser = following.find(u => u.id === ticket.userId);
        
        if (event && followedUser) {
          allActivities.push({
            id: `ticket-${ticket.id}`,
            type: 'ticket',
            userId: ticket.userId,
            userName: followedUser.name,
            userRole: followedUser.role,
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventLocation: event.location,
            eventImage: event.image,
            timestamp: `${ticket.purchaseDate}T12:00:00`,
            ticketQuantity: ticket.quantity
          });
        }
      }
    });

    // Get review activities
    reviews.forEach(review => {
      if (followingIds.includes(review.userId)) {
        const event = events.find(e => e.id === review.eventId);
        const followedUser = following.find(u => u.id === review.userId);
        
        if (event && followedUser) {
          allActivities.push({
            id: `review-${review.id}`,
            type: 'review',
            userId: review.userId,
            userName: followedUser.name,
            userRole: followedUser.role,
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventLocation: event.location,
            eventImage: event.image,
            timestamp: `${review.date}T18:00:00`,
            rating: review.rating,
            comment: review.comment
          });
        }
      }
    });

    // Sort by timestamp (newest first)
    allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setActivities(allActivities);
  };

  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(activity => activity.type === filter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(activity => 
        activity.userName.toLowerCase().includes(searchLower) ||
        activity.eventTitle.toLowerCase().includes(searchLower) ||
        activity.eventLocation.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [activities, filter, searchTerm]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'favorite':
        return <Heart className="h-5 w-5 text-pink-500 fill-current" />;
      case 'ticket':
        return <Ticket className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-amber-500 fill-current" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'favorite':
        return 'favorited';
      case 'ticket':
        return `bought ${activity.ticketQuantity} ticket${activity.ticketQuantity !== 1 ? 's' : ''} for`;
      case 'review':
        return 'reviewed';
      default:
        return 'interacted with';
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to see what's happening.</p>
        </div>
      </div>
    );
  }

  const following = getFollowing(user.id);

  if (following.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">What's Up</h1>
            <p className="text-gray-600">See what people you follow are up to</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Start following people</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Follow other users to see their event activities, favorites, and reviews in your feed.
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
            >
              Discover Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate counts for each filter (based on all activities, not filtered by search)
  const favoritesCount = activities.filter(a => a.type === 'favorite').length;
  const ticketsCount = activities.filter(a => a.type === 'ticket').length;
  const reviewsCount = activities.filter(a => a.type === 'review').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's Up</h1>
          <p className="text-gray-600">See what people you follow are up to</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by person name or event title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', label: 'All Activity', count: activities.length },
                { id: 'favorites', label: 'Favorites', count: favoritesCount },
                { id: 'tickets', label: 'Tickets', count: ticketsCount },
                { id: 'reviews', label: 'Reviews', count: reviewsCount }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    filter === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      filter === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredActivities.length} result{filteredActivities.length !== 1 ? 's' : ''} found
              {searchTerm && (
                <span className="ml-2 text-sm text-blue-600">
                  for "{searchTerm}"
                </span>
              )}
            </p>
          </div>
        )}

        {/* Activity Feed */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-6">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Activity Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{activity.userName}</span>
                        <FollowButton 
                          targetUserId={activity.userId} 
                          targetUserName={activity.userName}
                          size="sm"
                          variant="icon"
                        />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.userRole === 'organizer' ? 'text-blue-600 bg-blue-100' :
                          activity.userRole === 'admin' ? 'text-pink-600 bg-pink-100' :
                          'text-gray-600 bg-gray-100'
                        }`}>
                          {activity.userRole}
                        </span>
                        <div className="flex items-center space-x-1">
                          {getActivityIcon(activity.type)}
                          <span className="text-gray-600 text-sm">
                            {getActivityText(activity)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{`${formatEventDate(activity.timestamp)} ${formatEventTime(activity.timestamp)}`}</p>
                    </div>
                  </div>
                </div>

                {/* Event Card */}
                <div className="px-6 pb-6">
                  <Link
                    to={`/event/${activity.eventId}`}
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Event Image or Date */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {activity.eventImage ? (
                          <img
                            src={activity.eventImage}
                            alt={activity.eventTitle}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-sm font-bold text-blue-600">
                              {new Date(activity.eventDate).getDate()}
                            </div>
                            <div className="text-xs text-gray-600">
                              {new Date(activity.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                          {activity.eventTitle}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{formatEventDate(activity.eventDate)} at {formatEventTime(activity.eventDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{activity.eventLocation}</span>
                          </div>
                        </div>

                        {/* Activity-specific content */}
                        {activity.type === 'review' && activity.rating && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= activity.rating!
                                      ? 'text-amber-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                {activity.rating}/5
                              </span>
                            </div>
                            {activity.comment && (
                              <p className="text-sm text-gray-700 leading-relaxed">
                                "{activity.comment}"
                              </p>
                            )}
                          </div>
                        )}

                        {activity.type === 'ticket' && activity.ticketQuantity && (
                          <div className="mt-3 flex items-center text-sm text-blue-600">
                            <Ticket className="h-4 w-4 mr-1" />
                            <span>{activity.ticketQuantity} ticket{activity.ticketQuantity !== 1 ? 's' : ''} purchased</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matching results' : 'No activity yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No activities found matching "${searchTerm}". Try a different search term.`
                : filter === 'all' 
                ? 'People you follow haven\'t been active recently.'
                : `No ${filter} activity from people you follow.`
              }
            </p>
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/discover"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
              >
                Discover Events
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}