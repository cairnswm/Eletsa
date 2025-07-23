import React from 'react';
import { Navigation } from 'lucide-react';

interface LocationShareProps {
  latitude: number;
  longitude: number;
  locationName: string;
  className?: string;
}

export const LocationShare: React.FC<LocationShareProps> = ({
  latitude,
  longitude,
  locationName,
  className = '',
}) => {
  const handleNavigate = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const url = isIOS
      ? `http://maps.apple.com/?daddr=${latitude},${longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleNavigate}
      className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white rounded-lg hover:opacity-90 transition-all duration-200 ${className}`}
      title={`Navigate to ${locationName}`}
    >
      <Navigation className="w-4 h-4" />
      <span className="text-sm font-medium">Get Directions</span>
    </button>
  );
};