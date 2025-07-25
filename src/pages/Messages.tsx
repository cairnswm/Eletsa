import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft, Plus, Search } from 'lucide-react';
import { useMessaging } from '../contexts/MessagingContext';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { UserInitials } from '../components/user/UserInitials';
import { UserName } from '../components/user/UserName';
import { Conversation, Message } from '../types/messaging';

export const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasCompletedProfile } = useAuth();
  const { getUser } = useUser();
  const {
    conversations,
    activeConversationId,
    activeConversation,
    conversationMessages,
    loading,
    error,
    setActiveConversationId,
    sendMessage,
    markAsRead,
    clearError,
  } = useMessaging();

  console.log("activeConversationId:", activeConversationId);
  console.log("activeConversation:", activeConversation);
  console.log("conversationMessages:", conversationMessages);

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage(newMessage);
      setNewMessage('');
      
      // After sending a message, ensure the conversation is marked as read
      if (activeConversationId) {
        // Mark as read with the latest message ID after sending
        const latestMessage = conversationMessages[conversationMessages.length - 1];
        if (latestMessage) {
          markAsRead(activeConversationId, latestMessage.id);
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getConversationTitle = (conversation: Conversation) => {
    // Check if metadata has a title
    if (conversation.metadata?.name) {
      return conversation.metadata.name;
    }
    
    // Check for other metadata fields that might contain the title
    if (conversation.metadata?.title) {
      return conversation.metadata.title;
    }
    
    // For event type conversations, use the event name
    if (conversation.type === 'event' && conversation.metadata?.name) {
      return `Event: ${conversation.metadata.name}`;
    }

    // Get other users in the conversation
    const otherUserIds = new Set<number>();
    conversation.messages?.forEach((message: Message) => {
      if (message.user_id !== user?.id) {
        otherUserIds.add(message.user_id);
      }
      if (message.to_user_id !== user?.id) {
        otherUserIds.add(message.to_user_id);
      }
    });

    if (otherUserIds.size === 0) return 'Empty Conversation';
    if (otherUserIds.size === 1) {
      const otherUserId = Array.from(otherUserIds)[0];
      const otherUser = getUser(otherUserId);
      if (otherUser?.firstname && otherUser?.lastname) {
        return `${otherUser.firstname} ${otherUser.lastname}`;
      }
      if (otherUser?.username) {
        return otherUser.username;
      }
      if (otherUser?.email) {
        return otherUser.email;
      }
      return `User ${otherUserId}`;
    }

    return `Group Chat (${otherUserIds.size} people)`;
  };

  const getLastMessage = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      // Check if metadata has a name field
      if (conversation.metadata?.name) {
        return conversation.metadata.name;
      }
      // If no metadata name, return empty string (don't display anything)
      return '';
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.text;
  };

  const getLastMessageTime = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return '';
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return formatMessageTime(lastMessage.created_at);
  };

  const filteredConversations = conversations.filter(conversation => {
    const title = getConversationTitle(conversation).toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  const getOtherUsers = (conversation: Conversation) => {
    if (!conversation.users || !user) return [];
    
    // Get all user IDs except the current user
    const otherUserIds = conversation.users.filter(userId => userId !== user.id);
    
    // Get user objects for display
    return otherUserIds.map(userId => getUser(userId)).filter(Boolean);
  };
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className={`${activeConversationId ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r border-gray-200 flex flex-col`}>
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-6 h-6 text-[#1E30FF]" />
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-[#1E30FF] hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {error && (
                  <div className="p-4 bg-red-50 border-b border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-red-600 text-xs underline mt-1"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {loading && conversations.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
                    <span className="ml-3 text-gray-600">Loading conversations...</span>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setActiveConversationId(conversation.id)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                          activeConversationId === conversation.id ? 'bg-[#1E30FF]/5 border-r-2 border-[#1E30FF]' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3 relative">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {conversation.users && conversation.users.some((id) => id !== user?.id) ? (
                                <UserName userId={conversation.users.find((id) => id !== user?.id) as number} />
                              ) : (
                                'Unknown User'
                              )}
                            </h3>
                            <p className="text-sm text-gray-500">{getLastMessage(conversation)}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-xs text-gray-400">{getLastMessageTime(conversation)}</span>
                            {conversation.unread_messages > 0 && (
                              <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {conversation.unread_messages > 99 ? '99+' : conversation.unread_messages}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600 text-center text-sm">
                      {searchTerm ? 'No conversations match your search' : 'Start a conversation from an event or user profile'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`${activeConversationId ? 'block' : 'hidden lg:block'} flex-1 flex flex-col`}>
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setActiveConversationId(null)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {getConversationTitle(activeConversation)}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {activeConversation.status === 'active' ? 'Active' : activeConversation.status}
                        </p>
                        {/* Chatting with section */}
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <span>Chatting with:</span>
                          <div className="flex items-center space-x-1">
                            {getOtherUsers(activeConversation).map((otherUser, index) => (
                              <div key={otherUser?.id || index} className="flex items-center">
                                {otherUser ? (
                                  <UserName 
                                    userId={otherUser.id} 
                                    showFollowButton={false}
                                    className="text-xs"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-500">Loading...</span>
                                )}
                                {index < getOtherUsers(activeConversation).length - 1 && (
                                  <span className="text-gray-400 mx-1">,</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading && conversationMessages.length === 0 ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
                          <span className="text-gray-600">Loading messages...</span>
                        </div>
                      </div>
                    ) : conversationMessages.length > 0 ? (
                      conversationMessages.map((message, index) => {
                        const isOwnMessage = message.user_id === user.id;
                        const showAvatar = index === 0 || conversationMessages[index - 1].user_id !== message.user_id;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}
                          >
                            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {!isOwnMessage && showAvatar && (
                                <UserInitials userId={message.user_id} className="w-8 h-8" />
                              )}
                              {!isOwnMessage && !showAvatar && (
                                <div className="w-8 h-8 flex-shrink-0"></div>
                              )}

                              <div className={`px-4 py-2 rounded-2xl ${
                                isOwnMessage
                                  ? 'bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                  {formatMessageTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No messages in this conversation yet</p>
                          <p className="text-sm text-gray-500">Send a message to get started!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {hasCompletedProfile ? (
                      <form onSubmit={handleSendMessage} className="flex space-x-3">
                        <div className="flex-1">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent resize-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                              }
                            }}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sending}
                          className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white p-3 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-gray-600 text-sm mb-2">Complete your profile to send messages</p>
                        <button
                          onClick={() => navigate('/profile')}
                          className="text-[#1E30FF] hover:text-[#FF2D95] font-medium text-sm transition-colors duration-200"
                        >
                          Go to Profile
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};