import React, { useState } from 'react';
import { Key, QrCode, X } from 'lucide-react';
import { Event } from '../../types/event';
import { PDFExportButton } from './PDFExportButton';
import QRCode from 'qrcode';

interface OrganizerEventDetailsProps {
  event: Event;
}

export const OrganizerEventDetails: React.FC<OrganizerEventDetailsProps> = ({ event }) => {
  const [showEventCodeQR, setShowEventCodeQR] = useState(false);
  const [eventCodeQRDataUrl, setEventCodeQRDataUrl] = useState<string>('');

  const generateEventCodeQR = async () => {
    if (!event.code) return;

    try {
      const dataUrl = await QRCode.toDataURL(event.code, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setEventCodeQRDataUrl(dataUrl);
      setShowEventCodeQR(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  if (!event.code) return null;

  return (
    <>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Key className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-900">Event Code (Organizer Only)</h3>
        </div>
        <div className="bg-white rounded-lg p-3 border border-blue-200">
          <code className="text-sm font-mono text-blue-800 break-all">
            {event.code}
          </code>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          This unique code identifies your event in the system
        </p>
        <div className="flex space-x-3 mt-3">
          <button
            onClick={generateEventCodeQR}
            className="bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Show QR Code</span>
          </button>
          <PDFExportButton
            eventTitle={event.title}
            eventCode={event.code}
            eventLocation={event.location_name}
            startDateTime={event.start_datetime}
            endDateTime={event.end_datetime}
          />
        </div>
      </div>

      {/* Event Code QR Modal */}
      {showEventCodeQR && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowEventCodeQR(false)}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-full flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Event Code QR</h3>
                    <p className="text-sm text-gray-600">Scan to access event details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEventCodeQR(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* QR Code Display */}
              <div className="text-center">
                {eventCodeQRDataUrl && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
                    <img 
                      src={eventCodeQRDataUrl} 
                      alt="Event Code QR" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 font-mono mb-1 break-all">
                    {event.code}
                  </div>
                  <div className="text-xs text-gray-500">
                    Event identification code
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowEventCodeQR(false)}
                  className="w-full bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};