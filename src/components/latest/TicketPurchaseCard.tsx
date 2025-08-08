import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ActivityItem } from '../../types/activity';

interface TicketPurchaseCardProps {
  activity: ActivityItem;
  children: React.ReactNode;
}

export const TicketPurchaseCard: React.FC<TicketPurchaseCardProps> = ({ activity, children }) => {
  return (
    <div className="bg-gradient-to-r from-[#FF2D95]/10 to-[#f0900a]/10 border-[#FF2D95]/20 rounded-xl border p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <MessageCircle className="w-5 h-5 text-[#FF2D95]" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium leading-relaxed">
            {children}
          </div>
          {activity.ticket_type_name && activity.ticket_quantity && (
            <div className="mt-2 text-sm text-gray-600">
              {activity.ticket_quantity} × {activity.ticket_type_name} 
              {activity.ticket_quantity > 1 ? ' tickets' : ' ticket'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
