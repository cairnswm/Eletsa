import React, { useState } from 'react';
import { X, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../types/event';

interface ContactOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess: () => void;
}

export const ContactOrganizerModal: React.FC<ContactOrganizerModalProps> = ({
  isOpen,
  onClose,
  event,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { startConversation } = useMessaging();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  React.useEffect(() => {
    console.log('ContactOrganizerModal props:', { isOpen, event: event?.title, user: user?.id });
  }, [isOpen, event, user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with message:', message);
    
    if (!message.trim() || !user || sending) return;
    
    // Don't allow contacting yourself
    if (user.id === event.organizer_id) {
      setError("You cannot contact yourself");
      return;
    }

    try {
      setSending(true);
      setError(null);
      
      console.log('Starting conversation with:', {
        organizerId: event.organizer_id,
        message: message.trim(),
        type: 'event',
        typeId: event.id,
        metadata: {
          name: event.title,
          details: event.description
        }
      });
      
      await startConversation(
        event.organizer_id,
        message.trim(),
        'event',
        event.id,
        {
          name: event.title,
          details: event.description
        }
      );
      
      console.log('Conversation started successfully');
      
      // Reset form and close modal
      setMessage('');
      onClose();
      onSuccess();
      
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    console.log('Modal closing');
    setMessage('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Contact Organizer</h3>
                <p className="text-sm text-gray-600">Send a message about "{event.title}"</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to ask the organizer?
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi! I'm interested in "${event.title}". Could you provide more information?`}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent resize-none"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This will start a new conversation about this event
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="flex-1 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[#1E30FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};