import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import { X, MapPin, Navigation } from 'lucide-react';
import { LocationShare } from './LocationShare';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  locationName: string;
  eventTitle: string;
}

export const LocationViewModal: React.FC<LocationViewModalProps> = ({
  isOpen,
  onClose,
  latitude,
  longitude,
  locationName,
  eventTitle,
}) => {
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Event Location</h3>
                <p className="text-sm text-gray-600">{eventTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Map */}
          <div className="relative h-96">
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, longitude]} />
            </MapContainer>
          </div>

          {/* Location Info */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Location Details</h4>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#FF2D95] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{locationName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
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
                Close
              </button>
              <div className="flex-1">
                <LocationShare 
                  latitude={latitude} 
                  longitude={longitude}
                  locationName={locationName}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};