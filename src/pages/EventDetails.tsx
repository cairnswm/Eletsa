import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { organizers as organizersData } from '../data/organizers';
import { CommentsSection } from '../components/CommentsSection';
import { OrganizerCommentsSection } from '../components/OrganizerCommentsSection';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  ArrowLeft, 
  MessageCircle,
  Ticket,
  CreditCard,
  User,
  Heart,
  ShoppingCart,
  LogIn,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Edit,
  Award,
  CheckCircle
} from 'lucide-react';

interface Organizer {
  id: string;
  name: string;
  bio: string;
  eventCount: number;
  averageRating: number;
  testimonials: number[];
  avatar?: string;
}

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    events, 
    setActiveEventId, 
    activeEvent, 
    getEventReviews, 
    isPastEvent, 
    getAverageRating,
    toggleFavorite,
    isEventFavorited,
    getEventFavoriteCount,
    toggleReviewTestimonial,
    getOrganizerTestimonials
  } = useEvents();
  const { user, login } = useUser();
  const { addToCart, isInCart } = useCart();
  
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (id) {
      setActiveEventId(id);
    }
    return () => setActiveEventId(null);
  }, [id, setActiveEventId]);

  useEffect(() => {
    if (activeEvent) {
      fetchOrganizer(activeEvent.organizerId);
    }
  }, [activeEvent]);

  const fetchOrganizer = (organizerId: string) => {
    const org = organizersData.find((o: Organizer) => o.id === organizerId);
    if (org) {
      setOrganizer(org);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const success = await login(username, password);
      if (success) {
        setShowLoginModal(false);
        setShowPurchaseModal(true);
        // Reset form
        setUsername('');
        setPassword('');
        setShowPassword(false);
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const quickLogin = async (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const success = await login(user, pass);
      if (success) {
        setShowLoginModal(false);
        setShowPurchaseModal(true);
        // Reset form
        setUsername('');
        setPassword('');
        setShowPassword(false);
      } else {
        setLoginError('Login failed');
      }
    } catch (err) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const closeLoginModal = () => {
    if (isLoggingIn) return;
    
    setShowLoginModal(false);
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setLoginError('');
  };

  if (!activeEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link
            to="/discover"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const reviews = getEventReviews(activeEvent.id);
  const averageRating = getAverageRating(activeEvent.id);
  const isPast = isPastEvent(activeEvent);
  const availableSpots = activeEvent.maxParticipants - activeEvent.sold;
  const isSoldOut = availableSpots <= 0;
  const isFavorited = user ? isEventFavorited(activeEvent.id, user.id) : false;
  const favoriteCount = getEventFavoriteCount(activeEvent.id);
  const inCart = isInCart(activeEvent.id);

  // Check if user can edit this event
  const canEditEvent = user && (
    user.role === 'admin' || 
    (user.role === 'organizer' && activeEvent.organizerId === user.id)
  );

  // Check if user can moderate comments
  const canModerateComments = user && (
    user.role === 'admin' || 
    (user.role === 'organizer' && activeEvent.organizerId === user.id)
  );

  // Check if this is the organizer viewing their own event AND they came from My Events
  // We'll determine this by checking if they can edit the event (organizer/admin)
  // For now, we'll show organizer controls in reviews for organizers, but keep sidebar visible
  const isOrganizerManagingEvent = user && (
    user.role === 'admin' || 
    (user.role === 'organizer' && activeEvent.organizerId === user.id)
  );

  // Get testimonials for display in sidebar
  const testimonials = getOrganizerTestimonials(activeEvent.organizerId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    addToCart(activeEvent.id, quantity);
    setShowPurchaseModal(false);
    // You could show a toast notification here
  };

  const handleToggleFavorite = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    toggleFavorite(activeEvent.id, user.id);
  };

  const handleToggleTestimonial = (reviewId: string) => {
    toggleReviewTestimonial(reviewId);
  };

  const maxQuantity = Math.min(availableSpots, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/discover"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          
          {/* Edit Button for Organizers/Admins */}
          {canEditEvent && (
            <Link
              to={`/event/${activeEvent.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Link>
          )}
        </div>

        {/* Event Header with Image */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Hero Image */}
          {activeEvent.image && (
            <div className="relative h-64 md:h-80 lg:h-96">
              <img
                src={activeEvent.image}
                alt={activeEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Event Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="max-w-4xl">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {activeEvent.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {activeEvent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white bg-opacity-90 text-blue-700 text-sm rounded-full border border-blue-200 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Info Section */}
          <div className="p-6 md:p-8">
            {!activeEvent.image && (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{activeEvent.title}</h1>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Details */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-6 w-6 mr-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-lg">{formatDate(activeEvent.date)}</div>
                      <div className="text-gray-600">{formatTime(activeEvent.date)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-6 w-6 mr-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-lg">{activeEvent.location}</div>
                      <div className="text-gray-600">Venue location</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Users className="h-6 w-6 mr-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-lg">{activeEvent.sold} / {activeEvent.maxParticipants}</div>
                      <div className="text-gray-600">People attending</div>
                    </div>
                  </div>
                  
                  {favoriteCount > 0 && (
                    <div className="flex items-center text-gray-700">
                      <Heart className="h-6 w-6 mr-4 text-pink-500 fill-current" />
                      <div>
                        <div className="font-semibold text-lg">{favoriteCount}</div>
                        <div className="text-gray-600">People interested</div>
                      </div>
                    </div>
                  )}
                  
                  {isPast && reviews.length > 0 && (
                    <div className="flex items-center text-gray-700">
                      <Star className="h-6 w-6 mr-4 text-amber-500 fill-current" />
                      <div>
                        <div className="font-semibold text-lg">{averageRating.toFixed(1)} / 5</div>
                        <div className="text-gray-600">{reviews.length} reviews</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price and Action */}
              <div className="lg:text-right">
                <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl p-6 border border-blue-100">
                  <div className="text-4xl font-bold text-gray-900 mb-4">
                    {activeEvent.price === 0 ? (
                      <span className="text-yellow-600">Free</span>
                    ) : (
                      `R${activeEvent.price}`
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {/* Favorite Button */}
                    <button
                      onClick={handleToggleFavorite}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                        isFavorited
                          ? 'bg-pink-100 text-pink-700 border border-pink-300 hover:bg-pink-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                      {isFavorited ? 'Favorited' : 'Add to Favorites'}
                    </button>
                    
                    {/* Buy Ticket / Login Button */}
                    {!isPast && !isSoldOut && (
                      <button
                        onClick={() => user ? setShowPurchaseModal(true) : setShowLoginModal(true)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                      >
                        {user ? (
                          <>
                            {inCart ? (
                              <>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add More to Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <LogIn className="h-5 w-5 mr-2" />
                            Login to Buy Tickets
                          </>
                        )}
                      </button>
                    )}
                    
                    {isSoldOut && (
                      <div className="w-full px-6 py-4 bg-gray-100 text-gray-600 font-semibold rounded-xl text-center">
                        Sold Out
                      </div>
                    )}
                    
                    {isPast && (
                      <div className="w-full px-6 py-4 bg-gray-100 text-gray-600 font-semibold rounded-xl text-center">
                        Past Event
                      </div>
                    )}
                  </div>

                  {!isPast && !isSoldOut && (
                    <p className="text-sm text-gray-600 mt-3">
                      {availableSpots} spots remaining
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{activeEvent.description}</p>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Event Agenda</h3>
              <p className="text-gray-700 leading-relaxed">{activeEvent.agenda}</p>
            </div>

            {/* Comments Section - Use organizer version if user can moderate */}
            {canModerateComments ? (
              <OrganizerCommentsSection eventId={activeEvent.id} canModerate={true} />
            ) : (
              <CommentsSection eventId={activeEvent.id} />
            )}

            {/* Reviews (for past events) */}
            {isPast && reviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Reviews ({reviews.length})
                  {isOrganizerManagingEvent && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      - Select reviews to feature as testimonials
                    </span>
                  )}
                </h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= review.rating
                                    ? 'text-amber-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{review.date}</span>
                          {review.isTestimonial && (
                            <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Featured
                            </div>
                          )}
                        </div>
                        
                        {/* Testimonial Toggle for Organizers */}
                        {isOrganizerManagingEvent && (
                          <button
                            onClick={() => handleToggleTestimonial(review.id)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              review.isTestimonial
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {review.isTestimonial ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Featured
                              </>
                            ) : (
                              <>
                                <Award className="h-3 w-3 mr-1" />
                                Feature
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Profile - Always show */}
            {organizer && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Organizer</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/organizer/${organizer.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {organizer.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{organizer.bio}</p>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <span>{organizer.eventCount} events</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-amber-400 fill-current mr-1" />
                        <span>{organizer.averageRating.toFixed(1)} rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/organizer/${organizer.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    View Full Profile →
                  </Link>
                </div>
              </div>
            )}

            {/* Testimonials - Always show when they exist */}
            {testimonials.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What People Say</h3>
                <div className="space-y-4">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <div key={testimonial.id} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= testimonial.rating
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{testimonial.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{testimonial.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Login to Continue</h3>
              <button
                onClick={closeLoginModal}
                disabled={isLoggingIn}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 text-sm">{loginError}</span>
                </div>
              )}

              <div>
                <label htmlFor="modal-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="modal-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your username"
                  required
                  disabled={isLoggingIn}
                />
              </div>

              <div>
                <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="modal-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    required
                    disabled={isLoggingIn}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoggingIn}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-pink-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Quick Login for Demo */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 text-center">Quick login for demo:</p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => quickLogin('thabo', 'pass123')}
                  className="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoggingIn}
                >
                  <span className="font-medium">Thabo</span> - Attendee
                </button>
                <button
                  onClick={() => quickLogin('lerato', 'organize1')}
                  className="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoggingIn}
                >
                  <span className="font-medium">Lerato</span> - Organizer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {showPurchaseModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to Cart</h3>
            
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: maxQuantity }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} ticket{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold">
                  {activeEvent.price === 0 ? 'Free' : `R${activeEvent.price * quantity}`}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
              >
                <ShoppingCart className="inline h-4 w-4 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}