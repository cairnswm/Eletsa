import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { EventDetails } from '../components/events/EventDetails';

export const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setActiveEventId } = useEvent();

  useEffect(() => {
    if (eventId) {
      const id = parseInt(eventId, 10);
      if (!isNaN(id)) {
        setActiveEventId(id);
      } else {
        // Invalid event ID, redirect to home
        navigate('/home');
      }
    }
  }, [eventId, setActiveEventId, navigate]);

  const handleBack = () => {
    console.log('Back button clicked, navigating to home');
    setActiveEventId(null);
    navigate('/home');
  };

  if (!eventId || isNaN(parseInt(eventId, 10))) {
    return null; // Will redirect in useEffect
  }

  return <EventDetails onBack={handleBack} />;
};