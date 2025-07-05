import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialLocation?: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const [position, setPosition] = useState<[number, number]>([
    initialLocation?.latitude || -26.2041, // Johannesburg default
    initialLocation?.longitude || 28.0473,
  ]);
  const [searchQuery, setSearchQuery] = useState(initialLocation?.name || '');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialLocation?.name || '');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Nominatim API for geocoding (free OpenStreetMap service)
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=za&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsReverseGeocoding(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setSelectedAddress(data.display_name);
        setSearchQuery(data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(query);
    }, 300);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition([lat, lng]);
    setSelectedAddress(result.display_name);
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          reverseGeocode(lat, lng);
        },
        (error) => {
          console.error('Geolocation failed:', error);
          alert('Unable to get your current location. Please select manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleConfirm = () => {
    onLocationSelect({
      name: selectedAddress || searchQuery || `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`,
      latitude: position[0],
      longitude: position[1],
    });
    onClose();
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Select Event Location</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for an address or venue..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                )}
              </div>
              <button
                onClick={handleCurrentLocation}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">Current Location</span>
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-900 line-clamp-2">
                        {result.display_name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="relative h-96">
            <MapContainer
              center={position}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              key={`${position[0]}-${position[1]}`} // Force re-render when position changes
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} />
              <MapClickHandler onLocationSelect={handleMapClick} />
            </MapContainer>

            {/* Loading overlay for reverse geocoding */}
            {isReverseGeocoding && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#1E30FF]" />
                  <span className="text-sm text-gray-600">Getting address...</span>
                </div>
              </div>
            )}
          </div>

          {/* Selected Location Info */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Location</h4>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#FF2D95] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {selectedAddress || 'Click on the map to select a location'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedAddress && !searchQuery}
                className="flex-1 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[#1E30FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};