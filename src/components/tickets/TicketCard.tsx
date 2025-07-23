import React, { useState } from 'react';
import { Calendar, MapPin, Clock, QrCode, Download, Trash2, Star, MessageSquare, Send } from 'lucide-react';
import { X } from 'lucide-react';
import { UserTicket } from '../../types/ticket';
import { LocationViewModal } from './LocationViewModal';
import { LocationShare } from './LocationShare';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TicketCardProps {
  ticket: UserTicket;
  showReviewOption?: boolean;
  isPastEvent?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, showReviewOption = false, isPastEvent = false }) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const getStatusColor = (used: number) => {
    return used === 0 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (used: number) => {
    return used === 0 ? 'Valid' : 'Used';
  };

  // Check if location coordinates are available
  const hasLocation = ticket.location_latitude && ticket.location_longitude && 
                     ticket.location_latitude !== '0' && ticket.location_longitude !== '0';

  const latitude = hasLocation ? parseFloat(ticket.location_latitude) : 0;
  const longitude = hasLocation ? parseFloat(ticket.location_longitude) : 0;

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(ticket.ticket_code, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(dataUrl);
      setShowQRCode(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Generate QR code if not already generated
      let qrDataUrl = qrCodeDataUrl;
      if (!qrDataUrl) {
        qrDataUrl = await QRCode.toDataURL(ticket.ticket_code, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      }

      // Create a temporary container for the PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '800px';
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';

      pdfContainer.innerHTML = `
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1E30FF, #FF2D95); padding: 20px; margin-bottom: 30px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; color: white;">
            <svg width="32" height="32" viewBox="0 0 100 100" style="margin-right: 12px;">
              <rect width="100" height="100" rx="20" fill="white"/>
              <text x="50" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#1E30FF">E</text>
            </svg>
            <span style="font-size: 28px; font-weight: bold; color: white;">Eletsa</span>
          </div>
          <div style="color: white; font-size: 16px; font-weight: 500;">https://eletsa.cairns.co.za</div>
        </div>

        <!-- Ticket Content -->
        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div style="flex: 1;">
              <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0 0 16px 0;">${ticket.event_title}</h1>
              <div style="margin-bottom: 8px; display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 8px;">📅</span>
                <span>${formatDate(ticket.start_datetime)}</span>
              </div>
              <div style="margin-bottom: 8px; display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 8px;">🕐</span>
                <span>${formatTime(ticket.start_datetime)}</span>
              </div>
              <div style="margin-bottom: 8px; display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 8px;">📍</span>
                <span>${ticket.location_name}</span>
              </div>
            </div>
            <div style="text-align: right; margin-left: 24px;">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; margin-bottom: 8px; ${ticket.used === 0 ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #f3f4f6; color: #374151;'}">${getStatusText(ticket.used)}</span>
              <div style="font-size: 24px; font-weight: bold; color: #111827;">${formatCurrency(parseFloat(ticket.price))}</div>
              <div style="font-size: 14px; color: #6b7280;">${ticket.quantity} ticket${ticket.quantity > 1 ? 's' : ''}</div>
            </div>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 14px; font-weight: 500; color: #111827;">${ticket.ticket_type}</div>
                <div style="font-size: 12px; color: #6b7280;">Purchased: ${formatDate(ticket.assigned_at)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code Section -->
        ${ticket.used === 0 ? `
        <div style="background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center;">
            <div style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 16px;">Entry Code</div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 16px;">
                <img src="${qrDataUrl}" alt="Ticket QR Code" style="width: 192px; height: 192px;" />
              </div>
              <div style="text-align: center;">
                <div style="font-size: 12px; color: #6b7280; font-family: monospace; margin-bottom: 4px;">${ticket.ticket_code}</div>
                <div style="font-size: 12px; color: #6b7280;">Show this code at the event entrance</div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
      `;

      document.body.appendChild(pdfContainer);

      // Generate canvas from the container
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove the temporary container
      document.body.removeChild(pdfContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Download the PDF
      const fileName = `ticket-${ticket.event_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${ticket.ticket_code.slice(0, 8)}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      // TODO: Implement review submission API call
      console.log('Submitting review:', {
        eventTitle: ticket.event_title,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      
      // Reset form and close
      setReviewData({ rating: 0, comment: '' });
      setShowReviewForm(false);
      
      // Show success message (you might want to add a toast notification here)
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {ticket.event_title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-[#1E30FF]" />
                  <span>{formatDate(ticket.start_datetime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-[#489707]" />
                  <span>{formatTime(ticket.start_datetime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-[#FF2D95]" />
                  <span>{ticket.location_name}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right ml-6">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(ticket.used)}`}>
                {getStatusText(ticket.used)}
              </span>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(parseFloat(ticket.price))}
              </div>
              <div className="text-sm text-gray-600">
                {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{ticket.ticket_type}</div>
                  <div className="text-xs text-gray-500">
                    Purchased: {formatDate(ticket.assigned_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Location Button - only show if coordinates exist and not a past event */}
                {hasLocation && !isPastEvent && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowLocationModal(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">View Location</span>
                    </button>
                    <LocationShare 
                      latitude={latitude} 
                      longitude={longitude}
                      locationName={ticket.location_name}
                    />
                  </div>
                )}

                {!isPastEvent && ticket.used === 0 && (
                  <>
                    <button 
                      onClick={generateQRCode}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <QrCode className="w-4 h-4" />
                      <span className="text-sm font-medium">Show QR</span>
                    </button>
                    <button 
                      onClick={downloadPDF}
                      disabled={isGeneratingPDF}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">{isGeneratingPDF ? 'Generating...' : 'Download'}</span>
                    </button>
                  </>
                )}

                {/* Review Button for past events */}
                {showReviewOption && !ticket.rating && (
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] text-white rounded-lg hover:opacity-90 transition-all duration-200"
                  >
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {showReviewForm ? 'Cancel Review' : 'Add Review'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Existing Review Display for past events */}
        {isPastEvent && ticket.rating && (
          <div className="bg-yellow-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-900">Your Review</div>
            </div>
            <div className="space-y-3">
              {renderStars(ticket.rating)}
              {ticket.review && (
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <p className="text-sm text-gray-700">{ticket.review}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QR Code Section (expandable) */}
        {!isPastEvent && ticket.used === 0 && showQRCode && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-900">Entry Code</div>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              {qrCodeDataUrl && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Ticket QR Code" 
                    className="w-48 h-48"
                  />
                </div>
              )}
              <div className="text-center">
                <div className="text-xs text-gray-500 font-mono mb-1">{ticket.ticket_code}</div>
                <div className="text-xs text-gray-500">Show this code at the event entrance</div>
              </div>
            </div>
          </div>
        )}

        {/* Review Form Section */}
        {showReviewOption && showReviewForm && !ticket.rating && (
          <div className="bg-blue-50 px-6 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-900">Rate Your Experience</div>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className={`w-8 h-8 rounded-full transition-colors duration-200 ${
                        star <= reviewData.rating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <Star className={`w-6 h-6 ${star <= reviewData.rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {reviewData.rating > 0 ? `${reviewData.rating} star${reviewData.rating !== 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    id="review-comment"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience at this event..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewData.rating === 0 || submittingReview}
                  className="bg-gradient-to-r from-[#f0900a] to-[#FF2D95] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Location View Modal */}
      {hasLocation && !isPastEvent && (
        <LocationViewModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          latitude={latitude}
          longitude={longitude}
          locationName={ticket.location_name}
          eventTitle={ticket.event_title}
        />
      )}
    </>
  );
};