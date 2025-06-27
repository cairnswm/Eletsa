import React from 'react';
import { EventCard } from './EventCard';
import { Calendar } from 'lucide-react';

interface EventsGridProps {
  events: Array<{ id: string; date: string; title: string; description: string; tags: string[]; category: string; location: string }>;
  hasActiveFilters?: boolean;
  clearFilters?: () => void;
}

export const EventsGrid: React.FC<EventsGridProps> = ({ events, hasActiveFilters, clearFilters }) => {
  return (
    <div>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or check back later for new events.
          </p>
          {hasActiveFilters && clearFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
