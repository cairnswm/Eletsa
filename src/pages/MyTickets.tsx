import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useEvents } from '../contexts/EventContext';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  ArrowRight,
  X,
  Send
} from 'lucide-react';

interface TicketWithEvent {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  price: number;
  status: string;
  purchaseDate: string;
  event: any;
}

interface ReviewModalData {
  organizerId: number;
  organizerName: string;
  eventTitle: string;
  eventId: number;
}

export function MyTickets() {
  const { user } = useUser();
  const { events, tickets, getUserTickets, isPastEvent, getAverageRating, getEventReviews, reviews } = useEvents();
  const [showPastTickets, setShowPastTickets] = useState(false);
  const [ticketsWithEvents, setTicketsWithEvents] = useState<TicketWithEvent[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewModalData, setReviewModalData] = useState<ReviewModalData | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (user) {
      const userTickets = getUserTickets(user.id);
      const ticketsWithEventData = userTickets.map(ticket => {
        const event = events.find(e => e.id === ticket.eventId);
        return { ...ticket, event };
      }).filter(ticket => ticket.event); // Only include tickets with valid events

      setTicketsWithEvents(ticketsWithEventData);
    }
  }, [user, tickets, events, getUserTickets]);

  const handleReviewOrganizer = (ticket: TicketWithEvent) => {
    // Find organizer name from users data or use a default
    const organizerName = ticket.event.organizerId === 2 ? 'Lerato Events' : 
                         ticket.event.organizerId === 5 ? 'Zanele Events Co.' : 
                         'Event Organizer';
    
    setReviewModalData({
      organizerId: ticket.event.organizerId,
      organizerName,
      eventTitle: ticket.event.title,
      eventId: ticket.event.id
    });
    setReviewRating(0);
    setReviewComment('');
    setHoveredStar(0);
    setIsSubmitting(false);
    setShowSuccessAlert(false);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewModalData || !user || reviewRating === 0 || isSubmitting) return;

    setIsSubmitting(true);

    // Here you would typically save the review to your backend
    // For now, we'll just simulate the API call
    console.log('Review submitted:', {
      organizerId: reviewModalData.organizerId,
      eventId: reviewModalData.eventId,
      userId: user.id,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    });

    // Show success alert
    setShowSuccessAlert(true);

    // Close modal after 1 second
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewModalData(null);
      setReviewRating(0);
      setReviewComment('');
      setHoveredStar(0);
      setIsSubmitting(false);
      setShowSuccessAlert(false);
    }, 1000);
  };

  const closeReviewModal = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    
    setShowReviewModal(false);
    setReviewModalData(null);
    setReviewRating(0);
    setReviewComment('');
    setHoveredStar(0);
    setIsSubmitting(false);
    setShowSuccessAlert(false);
  };

  // Check if user has already reviewed this event
  const hasUserReviewedEvent = (eventId: number) => {
    if (!user) return false;
    return reviews.some(review => review.eventId === eventId && review.userId === user.id);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your tickets.</p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const upcomingTickets = ticketsWithEvents.filter(ticket => !isPastEvent(ticket.event));
  const pastTickets = ticketsWithEvents.filter(ticket => isPastEvent(ticket.event));
  const displayTickets = showPastTickets ? pastTickets : upcomingTickets;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status: string, isPast: boolean) => {
    if (isPast) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string, isPast: boolean) => {
    if (isPast) {
      return 'Attended';
    }
    
    switch (status) {
      case 'active':
        return 'Active';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const totalSpent = ticketsWithEvents.reduce((sum, ticket) => sum + ticket.price, 0);
  const upcomingEventsCount = upcomingTickets.length;
  const pastEventsCount = pastTickets.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage your event tickets and view past experiences</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{ticketsWithEvents.length}</div>
                <div className="text-sm text-gray-600">Total Tickets</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{upcomingEventsCount}</div>
                <div className="text-sm text-gray-600">Upcoming Events</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{pastEventsCount}</div>
                <div className="text-sm text-gray-600">Events Attended</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">
              {showPastTickets ? 'Past Events' : 'Upcoming Events'}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPastTickets(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !showPastTickets
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 border border-gray-300'
                }`}
              >
                Upcoming ({upcomingEventsCount})
              </button>
              <button
                onClick={() => setShowPastTickets(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPastTickets
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 border border-gray-300'
                }`}
              >
                Past ({pastEventsCount})
              </button>
            </div>
          </div>

          {displayTickets.length > 0 ? (
            <div className="space-y-4">
              {displayTickets.map((ticket) => {
                const isPast = isPastEvent(ticket.event);
                const averageRating = getAverageRating(ticket.event.id);
                const reviewCount = getEventReviews(ticket.event.id).length;
                const hasReviewed = hasUserReviewedEvent(ticket.event.id);

                return (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link
                              to={`/event/${ticket.event.id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                            >
                              {ticket.event.title}
                            </Link>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(ticket.event.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{formatTime(ticket.event.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{ticket.event.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(ticket.status, isPast)}
                            <span className={`text-sm font-medium ${
                              isPast ? 'text-green-600' : 
                              ticket.status === 'active' ? 'text-green-600' : 
                              ticket.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {getStatusText(ticket.status, isPast)}
                            </span>
                          </div>
                        </div>

                        {/* Ticket Details */}
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Quantity:</span> {ticket.quantity}
                          </div>
                          <div>
                            <span className="font-medium">Total Paid:</span> R{ticket.price}
                          </div>
                          <div>
                            <span className="font-medium">Purchase Date:</span> {ticket.purchaseDate}
                          </div>
                        </div>

                        {/* Past Event - Show Rating */}
                        {isPast && reviewCount > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-amber-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
                          </div>
                        )}

                        {/* Review Status for Past Events */}
                        {isPast && hasReviewed && (
                          <div className="flex items-center space-x-2 mt-3">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">You've reviewed this event</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/event/${ticket.event.id}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Event
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>

                        {/* Past Event - Review Organizer */}
                        {isPast && (
                          <button
                            onClick={() => handleReviewOrganizer(ticket)}
                            disabled={hasReviewed}
                            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                              hasReviewed
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                            title={hasReviewed ? 'You have already reviewed this event' : 'Review this organizer'}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            {hasReviewed ? 'Already Reviewed' : 'Review Organizer'}
                          </button>
                        )}

                        {/* Upcoming Event - Message Organizer */}
                        {!isPast && ticket.status === 'active' && (
                          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {showPastTickets ? 'past' : 'upcoming'} tickets
              </h3>
              <p className="text-gray-600 mb-6">
                {showPastTickets 
                  ? 'You haven\'t attended any events yet.'
                  : 'You don\'t have any upcoming events.'
                }
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Discover Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            {/* Success Alert */}
            {showSuccessAlert && (
              <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h3>
                  <p className="text-gray-600">Your review has been submitted successfully.</p>
                </div>
              </div>
            )}

            {/* Modal Content */}
            <div className={showSuccessAlert ? 'opacity-0' : 'opacity-100'}>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Review Organizer</h3>
                <button
                  onClick={closeReviewModal}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Event Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-1">{reviewModalData.eventTitle}</h4>
                <p className="text-sm text-gray-600">Organized by {reviewModalData.organizerName}</p>
              </div>

              {/* Rating Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate this organizer? *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      disabled={isSubmitting}
                      className="transition-colors disabled:opacity-50"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredStar || reviewRating)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {reviewRating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {reviewRating === 1 && 'Poor - Had significant issues'}
                    {reviewRating === 2 && 'Fair - Below expectations'}
                    {reviewRating === 3 && 'Good - Met expectations'}
                    {reviewRating === 4 && 'Very Good - Exceeded expectations'}
                    {reviewRating === 5 && 'Excellent - Outstanding experience'}
                  </p>
                )}
              </div>

              {/* Comment Section */}
              <div className="mb-6">
                <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (optional)
                </label>
                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none disabled:opacity-50 disabled:bg-gray-50"
                  placeholder="Tell others about your experience with this organizer..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewComment.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={closeReviewModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0 || isSubmitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="inline h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}