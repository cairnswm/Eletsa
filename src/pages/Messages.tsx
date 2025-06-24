import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useEvents } from '../contexts/EventContext';
import { messages as messagesData } from '../data/messages';
import { users as usersData } from '../data/users';
import { 
  MessageCircle, 
  Send, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ArrowLeft,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  eventId: string | null;
  timestamp: string;
  message: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface Conversation {
  userId: string;
  userName: string;
  userRole: string;
  eventId: string | null;
  eventTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export function Messages() {
  const { user } = useUser();
  const { events } = useEvents();
  const [messages, setMessages] = useState<Message[]>(messagesData);
  const [users] = useState<User[]>(usersData);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user && messages.length > 0 && users.length > 0) {
      organizeConversations();
    }
  }, [user, messages, users]);

  const organizeConversations = () => {
    if (!user) return;

    const userMessages = messages.filter(
      msg => msg.fromUserId === user.id || msg.toUserId === user.id
    );

    const conversationMap = new Map<string, Conversation>();

    userMessages.forEach(msg => {
      const otherUserId = msg.fromUserId === user.id ? msg.toUserId : msg.fromUserId;
      const otherUser = users.find(u => u.id === otherUserId);
      
      if (!otherUser) return;

      const key = `${Math.min(user.id, otherUserId)}-${Math.max(user.id, otherUserId)}-${msg.eventId || 'general'}`;
      
      if (!conversationMap.has(key)) {
        const event = msg.eventId ? events.find(e => e.id === msg.eventId) : null;
        
        conversationMap.set(key, {
          userId: otherUserId,
          userName: otherUser.name,
          userRole: otherUser.role,
          eventId: msg.eventId,
          eventTitle: event?.title,
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount: 0,
          messages: []
        });
      }

      const conversation = conversationMap.get(key)!;
      conversation.messages.push(msg);
      
      // Update last message if this one is newer
      if (new Date(msg.timestamp) > new Date(conversation.lastMessageTime)) {
        conversation.lastMessage = msg.message;
        conversation.lastMessageTime = msg.timestamp;
      }

      // Count unread messages (messages from others that are newer than some arbitrary "last read" time)
      if (msg.fromUserId !== user.id) {
        conversation.unreadCount++;
      }
    });

    const sortedConversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

    setConversations(sortedConversations);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      fromUserId: user.id,
      toUserId: selectedConversation.userId,
      eventId: selectedConversation.eventId,
      timestamp: new Date().toISOString(),
      message: newMessage.trim()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {conversations.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {conversations.map((conversation, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedConversation === conversation ? 'bg-purple-50 border-r-2 border-purple-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 truncate">{conversation.userName}</div>
                              <div className="text-xs text-gray-500 capitalize">{conversation.userRole}</div>
                            </div>
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
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{selectedConversation.userName}</div>
                          <div className="text-sm text-gray-600 capitalize">{selectedConversation.userRole}</div>
                        </div>
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
                                  <span>{formatEventDate(event.date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{formatEventTime(event.date)}</span>
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