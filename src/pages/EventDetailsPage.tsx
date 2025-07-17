import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { EventDetails } from '../components/events/EventDetails';

export const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setActiveEventId } = useEvent();

  // Set the active event when the component mounts or eventId changes
  React.useEffect(() => {
    if (eventId) {
      const numericEventId = parseInt(eventId);
      console.log(`Setting active event ID to: ${numericEventId}`);
      setActiveEventId(numericEventId);
    }
    
    // Clean up when component unmounts
    return () => {
      console.log('Cleaning up active event ID');
      setActiveEventId(null);
    };
  }, [eventId, setActiveEventId]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (!eventId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <button
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return <EventDetails onBack={handleBack} />;
};