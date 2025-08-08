import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EventNameProps {
  eventId: number;
  eventTitle: string;
  className?: string;
}

export const EventName: React.FC<EventNameProps> = ({ 
  eventId, 
  eventTitle, 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${eventId}`);
  };

  return (
    <span 
      onClick={handleClick}
      className={`text-[#1E30FF] hover:text-[#FF2D95] font-medium underline transition-colors duration-200 cursor-pointer ${className}`}
    >
      {eventTitle}
    </span>
  );
};