import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useEvents } from '../hooks/useEvents';
import { 
  MessageCircle, 
  Send, 
  Calendar, 
  MapPin,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserNameWithFollowButton } from '../components/UserNameWithFollowButton';
import { Conversation } from '../types/messages.types';
import { useMessages } from '../hooks/useMessages';
import { formatDate, formatTime } from '../utils/dateUtils';

export function Messages() {
  const { user } = useUser();
  const { events } = useEvents();
  const { conversations, organizeConversations } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      organizeConversations();
    }
  }, [user, organizeConversations]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: `msg-${Date.now()}`,
      fromUserId: 'currentUserId',
      toUserId: selectedConversation.userId,
      eventId: selectedConversation.eventId,
      timestamp: new Date().toISOString(),
      message: newMessage.trim(),
    };

    // Add message to context or handle it appropriately
    setNewMessage('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your messages.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Filter conversations to exclude those with the logged-in user's name
  const filteredConversations = conversations.map((conversation: Conversation) => {
    const otherUserName = conversation.userId === user.id ? conversation.userName : conversation.userName;
    return { ...conversation, displayName: otherUserName };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with event organizers and attendees</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: '70vh' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredConversations.map((conversation, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedConversation === conversation ? 'bg-purple-50 border-r-2 border-purple-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <UserNameWithFollowButton
                              userName={conversation.displayName}
                              userId={Number(conversation.userId)}
                              link={undefined}
                              imageUrl={undefined}
                            />
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {conversation.eventTitle && (
                          <div className="text-xs text-purple-600 mb-1 truncate">
                            📅 {conversation.eventTitle}
                          </div>
                        )}
                        
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600">Start a conversation by messaging an event organizer.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UserNameWithFollowButton
                          userName={selectedConversation.userName}
                          userId={Number(selectedConversation.userId)}
                          link={undefined}
                          imageUrl={undefined}
                        />
                      </div>
                      
                      {selectedConversation.eventId && (
                        <Link
                          to={`/event/${selectedConversation.eventId}`}
                          className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          View Event →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Event Context (if applicable) */}
                  {selectedConversation.eventId && (
                    <div className="p-4 bg-purple-50 border-b border-purple-200">
                      {(() => {
                        const event = events.find(e => e.id === selectedConversation.eventId);
                        if (!event) return null;
                        
                        return (
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/event/${event.id}`}
                                className="font-medium text-gray-900 hover:text-purple-600 transition-colors block truncate"
                              >
                                {event.title}
                              </Link>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{formatTime(event.date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.fromUserId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.fromUserId === user.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.fromUserId === user.id ? 'text-purple-200' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the left to start messaging.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}