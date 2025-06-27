import React, { createContext, useContext, useEffect, useState } from 'react';
import { Message, Conversation } from '../types/messages.types';
import { messages as messagesData } from '../data/messages';
import { users as usersData } from '../data/users';
import { useUser } from '../hooks/useUser';

interface MessagesContextProps {
  messages: Message[];
  conversations: Conversation[];
  organizeConversations: () => void;
}

export const MessagesContext = createContext<MessagesContextProps | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user } = useUser();

  const organizeConversations = React.useCallback(() => {
    const conversationMap = new Map<string, Conversation>();

    messages.forEach((msg) => {
      const otherUserId = msg.fromUserId === user?.id ? msg.toUserId : msg.fromUserId;
      const otherUser = usersData.find((u) => u.id === otherUserId);

      if (!otherUser) return;

      const key = `${user?.id}-${otherUserId}-${msg.eventId || 'general'}`;

      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          userId: otherUserId,
          userName: otherUser.name,
          userRole: otherUser.role,
          eventId: msg.eventId,
          eventTitle: '',
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount: 0,
          messages: [],
        });
      }

      const conversation = conversationMap.get(key)!;
      conversation.messages.push(msg);

      if (new Date(msg.timestamp) > new Date(conversation.lastMessageTime)) {
        conversation.lastMessage = msg.message;
        conversation.lastMessageTime = msg.timestamp;
      }

      if (msg.fromUserId !== 'currentUserId') {
        conversation.unreadCount++;
      }
    });

    const sortedConversations = Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    setConversations(sortedConversations);
  }, [messages]); // Memoized with useCallback

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setMessages(messagesData);
  };

  useEffect(() => {
    organizeConversations();
  }, [organizeConversations]);

  return (
    <MessagesContext.Provider value={{ messages, conversations, organizeConversations }}>
      {children}
    </MessagesContext.Provider>
  );
};


