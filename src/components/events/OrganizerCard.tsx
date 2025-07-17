import React from 'react';
import { Star, Shield, Calendar, Mail } from 'lucide-react';
import { Organizer } from '../../types/event';
import { UserName } from '../user/UserName';
import { UserImage } from '../user/UserImage';

interface OrganizerCardProps {
  organizer: Organizer;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Organizer</h3>
      
      <div className="flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          <UserImage userId={organizer.id} size="lg" />
          {organizer.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#489707] rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {/* Use UserName component for the organizer's name */}
            <UserName 
              userId={organizer.id} 
              showFollowButton={true}
              showIcon={false}
              className="text-base font-semibold"
            />
            {organizer.verified && (
              <span className="bg-[#489707] text-white px-2 py-0.5 rounded-full text-xs font-medium">
                Verified
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{organizer.rating}</span>
            <span className="text-sm text-gray-500">({organizer.events_count} events)</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
            <Calendar className="w-4 h-4" />
            <span>{organizer.events_count} events organized</span>
          </div>
        </div>
      </div>
      
      {organizer.description && (
        <p className="text-gray-600 text-sm mt-4 leading-relaxed">
          {organizer.description}
        </p>
      )}
      
      <div className="mt-6 space-y-3">
        <button className="w-full bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200">
          Follow Organizer
        </button>
        
        <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>Contact</span>
        </button>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#1E30FF]">{organizer.events_count}</div>
            <div className="text-xs text-gray-600">Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FF2D95]">{organizer.rating}</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};