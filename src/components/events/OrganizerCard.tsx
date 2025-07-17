import React from 'react';
import { Star, Shield, Calendar, Mail } from 'lucide-react';
import { useOrganizer } from '../../contexts/OrganizerContext';
import { UserName } from '../user/UserName';
import { UserImage } from '../user/UserImage';

interface OrganizerCardProps {
  organizerId: number;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizerId }) => {
  const { getOrganizer } = useOrganizer();
  
  // Get organizer from OrganizerContext - this will automatically fetch if not cached
  const organizer = getOrganizer(organizerId);
  
  if (!organizer) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Organizer</h3>
      
      <div className="flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          <UserImage userId={organizer.user_id} size="lg" />
          {organizer.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#489707] rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {/* Use UserName component for the organizer's name */}
            <UserName 
              userId={organizer.user_id} 
              showFollowButton={true}
              showIcon={false}
              className="text-base font-semibold"
            />
            {organizer.is_verified && (
              <span className="bg-[#489707] text-white px-2 py-0.5 rounded-full text-xs font-medium">
                Verified
              </span>
            )}
          </div>
          
          {organizer.positive_reviews > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{organizer.positive_reviews} positive reviews</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
            <Calendar className="w-4 h-4" />
            <span>{organizer.events_hosted} events organized</span>
          </div>
        </div>
      </div>
      
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
            <div className="text-2xl font-bold text-[#1E30FF]">{organizer.events_hosted}</div>
            <div className="text-xs text-gray-600">Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FF2D95]">{organizer.positive_reviews}</div>
            <div className="text-xs text-gray-600">Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};