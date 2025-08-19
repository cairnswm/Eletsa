import React from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, Shield, CreditCard, ChevronLeft, ChevronRight, X, MessageCircle } from 'lucide-react';
import { useEvent } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TicketTypeCard } from './TicketTypeCard';
import { TicketPurchaseModal } from './TicketPurchaseModal';
import { CommentSection } from './CommentSection';
import { OrganizerCard } from './OrganizerCard';
import { ContactOrganizerModal } from './ContactOrganizerModal';
import { OrganizerEventDetails } from './OrganizerEventDetails';
import { TicketType } from '../../types/event';
import { ReviewsSection } from './ReviewsSection';

interface EventDetailsProps {
  onBack: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ onBack }) => {
  const { activeEvent, ticketTypes, comments, organizer, reviews, loading } = useEvent();
  const { user, hasCompletedProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [showTicketModal, setShowTicketModal] = React.useState(false);
  const [selectedTicketType, setSelectedTicketType] = React.useState<TicketType | null>(null);
  const [activeTab, setActiveTab] = React.useState<'comments' | 'reviews'>('comments');

  // Check if event is in the past
  const isEventPast = activeEvent ? new Date(activeEvent.end_datetime) < new Date() : false;
  
  // Check if current user is the organizer
  const isOrganizer = user && activeEvent && user.id === activeEvent.organizer_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E30FF]"></div>
      </div>
    );
  }

  if (!activeEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
    if (activeEvent.images) {
      try {
        const images = JSON.parse(activeEvent.images);
        if (Array.isArray(images) && images.length > 0) {
          return images;
        }
      } catch (e) {
        return [activeEvent.images];
      }
    }
    return ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1'];
  };

  const eventImages = getEventImage();
  const mainImage = eventImages[0];
  const additionalImages = eventImages.slice(1);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : eventImages.length - 1));
    } else {
      setSelectedImageIndex((prev) => (prev < eventImages.length - 1 ? prev + 1 : 0));
    }
  };

  const handleContactSuccess = () => {
    // Navigate to messages page after successful contact
    navigate('/messages');
  };

  const handleBuyTickets = (ticketType: TicketType) => {
    setSelectedTicketType(ticketType);
    setShowTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setSelectedTicketType(null);
  };

  console.log("TICKETTYPES:", ticketTypes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#1E30FF] transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Events</span>
          </button>
        </div>
      </div>

      {/* Main Image Section */}
      <div className="relative">
        <div 
          className="relative h-80 overflow-hidden cursor-pointer"
          onClick={() => openImageModal(0)}
        >
          <img
            src={mainImage}
            alt={activeEvent.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Text Overlay with Opaque Background */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {activeEvent.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">
                      {activeEvent.popularity_score ? activeEvent.popularity_score.toFixed(1) : '4.5'}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {activeEvent.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(activeEvent.start_datetime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{formatTime(activeEvent.start_datetime)} - {formatTime(activeEvent.end_datetime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{activeEvent.location_name}</span>
                  </div>
                  {activeEvent.max_attendees > 0 && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>{activeEvent.max_attendees} spots</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Images Gallery */}
        {additionalImages.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">More Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {additionalImages.map((image, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  onClick={() => openImageModal(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${activeEvent.title} image ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation Buttons */}
            {eventImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Image */}
            <img
              src={eventImages[selectedImageIndex]}
              alt={`${activeEvent.title} image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Image Counter */}
            {eventImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {eventImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 60% */}
          <div className="lg:col-span-2 space-y-8">

            
              {/* Organizer Event Details */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer Controls</h2>            
              {isOrganizer && <OrganizerEventDetails event={activeEvent} />}
            </div>

            
            {/* Event Description */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {activeEvent.description}
              </p>
              
              {activeEvent.tags && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeEvent.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-[#1E30FF]/10 to-[#FF2D95]/10 text-[#1E30FF] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ticket Types */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tickets</h2>
              {ticketTypes.length > 0 ? (
                <div className="space-y-4">
                  {ticketTypes.map((ticketType) => (
                    <TicketTypeCard 
                      key={ticketType.id} 
                      ticketType={ticketType} 
                      onBuyTickets={handleBuyTickets}
                      eventTitle={activeEvent.title}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tickets available for this event</p>
                </div>
              )}
            </div>

            {/* Comments and Reviews Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'comments'
                        ? 'border-[#1E30FF] text-[#1E30FF]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Comments ({comments.length})</span>
                    </div>
                  </button>
                  
                  {isEventPast && (
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === 'reviews'
                          ? 'border-[#1E30FF] text-[#1E30FF]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Reviews ({reviews.length})</span>
                      </div>
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'comments' && (
                  <CommentSection comments={comments} eventId={activeEvent.id} />
                )}
                {activeTab === 'reviews' && isEventPast && (
                  <ReviewsSection reviews={reviews} eventId={activeEvent.id} />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 40% */}
          <div className="space-y-8">
            {/* Organizer Card */}
            {activeEvent && <OrganizerCard organizerId={activeEvent.organizer_id} />}

            {/* Contact Organizer */}
            {user && user.id !== activeEvent.organizer_id && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Organizer</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Have questions about this event? Send a message to the organizer.
                </p>
                <button
                  onClick={() => setShowContactModal(true)}
                  disabled={!hasCompletedProfile}
                  type="button"
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    hasCompletedProfile 
                      ? 'bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white hover:opacity-90' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Organizer</span>
                </button>
                {!hasCompletedProfile && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Complete your profile before contacting the organizer
                  </p>
                )}
                {!hasCompletedProfile && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full mt-2 text-[#1E30FF] hover:text-[#FF2D95] font-medium text-sm transition-colors duration-200"
                  >
                    Go to Profile
                  </button>
                )}
              </div>
            )}
            {/* Event Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeEvent.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {activeEvent.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">
                    {new Date(activeEvent.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {activeEvent.max_attendees > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Attendees</span>
                    <span className="text-gray-900">{activeEvent.max_attendees}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact Organizer Modal */}
      {activeEvent && (
        <ContactOrganizerModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          event={activeEvent}
          onSuccess={handleContactSuccess}
        />
      )}

      {/* Ticket Purchase Modal */}
      {selectedTicketType && (
        <TicketPurchaseModal
          isOpen={showTicketModal}
          onClose={handleCloseTicketModal}
          ticketType={selectedTicketType}
          eventTitle={activeEvent.title}
        />
      )}
    </div>
  );
};