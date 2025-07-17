import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Users, DollarSign, TrendingUp, Edit, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { useEvent } from '../contexts/EventContext';
import { EventCard } from '../components/events/EventCard';

export const MyEvents: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasCompletedProfile } = useAuth();
  const { getOrganizerByUserId, fetchOrganizerEvents, getOrganizerEvents } = useOrganizer();
  const { setActiveEventId } = useEvent();
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'past'>('active');
  const [loading, setLoading] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  // Get organizer data
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;

  // FIXED: Get organizer events using user.id instead of organizer.id
  // since organizer_id field in events table links to user table
  const organizerEvents = user ? getOrganizerEvents(user.id) : [];

  // Load organizer events when user is available
  useEffect(() => {
    const loadEvents = async () => {
      if (user && userOrganizer && !eventsLoaded) {
        setLoading(true);
        console.log(`Loading events for user ID: ${user.id}`);
        
        try {
          // FIXED: Use user.id instead of userOrganizer.id
          const events = await fetchOrganizerEvents(user.id);
          console.log(`Loaded ${events.length} events for user ID: ${user.id}`, events);
          setEventsLoaded(true);
        } catch (error) {
          console.error('Failed to load organizer events:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadEvents();
  }, [user?.id, userOrganizer, eventsLoaded, fetchOrganizerEvents]);

  // Reset events loaded when user changes
  useEffect(() => {
    setEventsLoaded(false);
  }, [user?.id]);

  // FIXED: Improved event categorization with better handling of empty/null status
  const now = new Date();
  console.log('Current time for categorization:', now.toISOString());
  
  const activeEvents = organizerEvents.filter(event => {
    const startDate = new Date(event.start_datetime);
    const endDate = new Date(event.end_datetime);
    
    // FIXED: Treat empty/null status as 'active' (default behavior)
    const status = event.status?.trim() || 'active';
    const isActive = status === 'active';
    const isUpcoming = startDate > now;
    const isNotEnded = endDate > now;
    
    console.log(`Event "${event.title}":`, {
      originalStatus: event.status,
      normalizedStatus: status,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive,
      isUpcoming,
      isNotEnded,
      shouldShowInActive: isActive && isNotEnded
    });
    
    // Show events that are active (or have empty status) and haven't ended yet
    return isActive && isNotEnded;
  });

  const draftEvents = organizerEvents.filter(event => {
    const status = event.status?.trim() || 'active';
    const isDraft = status === 'draft';
    console.log(`Event "${event.title}" draft status:`, isDraft, 'Original status:', event.status, 'Normalized:', status);
    return isDraft;
  });

  const pastEvents = organizerEvents.filter(event => {
    const endDate = new Date(event.end_datetime);
    const isPast = endDate < now;
    console.log(`Event "${event.title}" past status:`, isPast, 'End date:', endDate.toISOString());
    return isPast;
  });

  console.log('Event categorization results:', {
    total: organizerEvents.length,
    active: activeEvents.length,
    draft: draftEvents.length,
    past: pastEvents.length
  });

  const getCurrentEvents = () => {
    switch (activeTab) {
      case 'active':
        return activeEvents;
      case 'draft':
        return draftEvents;
      case 'past':
        return pastEvents;
      default:
        return activeEvents;
    }
  };

  const handleEventClick = (eventId: number) => {
    setActiveEventId(eventId);
    navigate('/home'); // Navigate to home which will show event details
  };

  const handleEditEvent = (eventId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card click
    navigate(`/edit-event/${eventId}`);
  };

  const currentEvents = getCurrentEvents();

  if (!userOrganizer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer Access Required</h2>
          <p className="text-gray-600 mb-6">You need to be an event organizer to access this page.</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">Manage and track your organized events</p>
            {process.env.NODE_ENV === 'development' && user && (
              <div className="text-xs text-blue-600 mt-1 space-y-1">
                <p>Debug: User ID {user.id}, Organizer ID {userOrganizer.id}, Events: {organizerEvents.length}, Loaded: {eventsLoaded ? 'Yes' : 'No'}</p>
                <p>Active: {activeEvents.length}, Draft: {draftEvents.length}, Past: {pastEvents.length}</p>
                {organizerEvents.length > 0 && (
                  <div className="bg-blue-50 p-2 rounded text-xs">
                    <p><strong>Events found:</strong></p>
                    {organizerEvents.map(event => (
                      <p key={event.id}>
                        • "{event.title}" - Status: "{event.status}" (normalized: "{event.status?.trim() || 'active'}"), Start: {new Date(event.start_datetime).toLocaleDateString()}, End: {new Date(event.end_datetime).toLocaleDateString()}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/create-event')}
            disabled={!hasCompletedProfile}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              hasCompletedProfile 
                ? 'bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white hover:opacity-90' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{organizerEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">{activeEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizerEvents.reduce((sum, event) => sum + (event.max_attendees || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizerEvents.length > 0 
                    ? (organizerEvents.reduce((sum, event) => sum + (event.popularity_score || 0), 0) / organizerEvents.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'active'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Events ({activeEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'draft'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Drafts ({draftEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'past'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Events ({pastEvents.length})
              </button>
            </nav>
          </div>

          {/* Events Grid */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
                <span className="ml-3 text-gray-600">Loading events...</span>
              </div>
            ) : currentEvents.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'active' && 'Active Events'}
                    {activeTab === 'draft' && 'Draft Events'}
                    {activeTab === 'past' && 'Past Events'}
                  </h2>
                  <span className="text-gray-600">
                    {currentEvents.length} event{currentEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentEvents.map((event) => (
                    <div key={event.id} className="relative group">
                      <EventCard
                        event={event}
                        onClick={() => handleEventClick(event.id)}
                      />
                      
                      {/* Edit Button Overlay */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => handleEditEvent(event.id, e)}
                          className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-lg hover:bg-white hover:text-[#1E30FF] transition-all duration-200"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : eventsLoaded ? (
              // Only show empty state if we've actually loaded events
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No {activeTab} events
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'active' && "You don't have any active events yet."}
                  {activeTab === 'draft' && "You don't have any draft events yet."}
                  {activeTab === 'past' && "You don't have any past events yet."}
                </p>
                {activeTab !== 'past' && (
                  <button 
                    onClick={() => navigate('/create-event')}
                    className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Event</span>
                  </button>
                )}
              </div>
            ) : (
              // Show loading state if events haven't been loaded yet
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
                <span className="ml-3 text-gray-600">Loading events...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};