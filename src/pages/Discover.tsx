import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Search, Filter, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { EventsGrid } from '../components/EventsGrid';

export function Discover() {
  const { events, categories, isPastEvent, getUserFavorites } = useEvents();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter out past events by default
  const upcomingEvents = events.filter(event => !isPastEvent(event));
  const cities = [...new Set(upcomingEvents.map(event => event.location))].sort();
  
  // Get user's favorite events
  const userFavorites = user ? getUserFavorites(user.id) : [];
  
  const getDateRangeFilter = (range: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { start: today, end: tomorrow };
      case 'weekend':
        const friday = new Date(today);
        const daysUntilFriday = (5 - today.getDay() + 7) % 7;
        friday.setDate(today.getDate() + daysUntilFriday);
        const sunday = new Date(friday);
        sunday.setDate(friday.getDate() + 2);
        return { start: friday, end: sunday };
      case 'next-week':
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
        return { start: nextWeekStart, end: nextWeekEnd };
      default:
        return null;
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = upcomingEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesCity = !selectedCity || event.location === selectedCity;
      
      let matchesDateRange = true;
      if (selectedDateRange) {
        const dateRange = getDateRangeFilter(selectedDateRange);
        if (dateRange) {
          const eventDate = new Date(event.date);
          matchesDateRange = eventDate >= dateRange.start && eventDate < dateRange.end;
        }
      }
      
      return matchesSearch && matchesCategory && matchesCity && matchesDateRange;
    });

    // Sort by favorites first (if user is logged in), then by date
    return filtered.sort((a, b) => {
      if (user) {
        const aIsFavorite = userFavorites.includes(a.id);
        const bIsFavorite = userFavorites.includes(b.id);
        
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
      }
      
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [upcomingEvents, searchTerm, selectedCategory, selectedCity, selectedDateRange, user, userFavorites]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedDateRange('');
  };

  const hasActiveFilters = Boolean(searchTerm || selectedCategory || selectedCity || selectedDateRange);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
            <p className="text-gray-600">Find your next amazing experience</p>
          </div>
          
          {user && (
            <Link
              to="/my-tickets"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
            >
              <Ticket className="h-4 w-4 mr-2" />
              Your Tickets
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t border-gray-200`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="weekend">This Weekend</option>
                  <option value="next-week">Next Week</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredEvents.length} upcoming event{filteredEvents.length !== 1 ? 's' : ''} found
            {hasActiveFilters && (
              <span className="ml-2 text-sm text-blue-600">
                (filtered)
              </span>
            )}
          </p>
        </div>

        {/* Events Grid */}
        <EventsGrid 
          events={filteredEvents} 
          hasActiveFilters={hasActiveFilters} 
          clearFilters={clearFilters} 
        />
      </div>
    </div>
  );
}