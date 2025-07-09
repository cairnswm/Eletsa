import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Conversation,
  Message,
  MessagingContextType,
} from "../types/messaging";
import { useAuth } from "./AuthContext";
import { useUser } from "./UserContext";

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined
);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
};

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { fetchBulkUsersFromRelations } = useUser();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationIdState] = useState<
    number | null
  >(null);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchConversations = async () => {
    if (!user || !window.Messages) return;

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching conversations for user:", user.id);
      const conversationsData = await window.Messages.getConv(user.id);
      console.log("Fetched conversations:", conversationsData);

      setConversations(conversationsData);

      // Calculate unread count (assuming we need to implement read status)
      // For now, we'll set it to 0 as we don't have read status in the API
      setUnreadCount(0);

      // Extract all user IDs from conversations for bulk user fetching
      const userIds = new Set<number>();
      conversationsData.forEach((conversation) => {
        conversation.messages?.forEach((message) => {
          userIds.add(message.userId);
          userIds.add(message.toUserId);
        });
      });

      // Create fake relations for bulk user fetching
      if (userIds.size > 0) {
        const fakeRelations = Array.from(userIds).map((userId) => ({
          id: 0,
          follower_user_id: userId,
          followed_user_id: userId,
          created_at: "",
          modified_at: "",
        }));

        try {
          await fetchBulkUsersFromRelations(fakeRelations);
        } catch (err) {
          console.error("Failed to bulk fetch users for conversations:", err);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch conversations";
      setError(errorMessage);
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const setActiveConversationId = (id: number | null) => {
    setActiveConversationIdState(id);

    if (id === null) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    // Always fetch the specific conversation to get the latest messages
    fetchSpecificConversation(id);
  };

  const fetchSpecificConversation = useCallback(
    async (conversationId: number) => {
      if (!window.Messages) return;

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching conversation ${conversationId} with messages...`);
        const conversationData = await window.Messages.getConversations(
          conversationId
        );

        const messages = Array.isArray(conversationData)
          ? conversationData[0].messages
          : conversationData.messages;

        console.log("Fetched messages:", messages);

        // Set messages in the new state
        setConversationMessages(messages || []);

        // Extract user IDs from messages for bulk user fetching
        const userIds = new Set<number>();
        messages?.forEach((message: Message) => {
          userIds.add(message.user_id);
          userIds.add(message.to_user_id);
        });

        // Bulk fetch user details for message participants
        if (userIds.size > 0) {
          const fakeRelations = Array.from(userIds).map((userId) => ({
            id: 0,
            follower_user_id: userId,
            followed_user_id: userId,
            created_at: "",
            modified_at: "",
          }));

          try {
            await fetchBulkUsersFromRelations(fakeRelations);
          } catch (err) {
            console.error(
              "Failed to bulk fetch users for conversation messages:",
              err
            );
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch conversation";
        setError(errorMessage);
        console.error("Failed to fetch conversation:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchBulkUsersFromRelations]
  );

  const sendMessage = async (text: string) => {
    if (!user || !window.Messages || !activeConversation) return;

    // Determine recipient
    let recipientId;
    if (activeConversation.messages && activeConversation.messages.length > 0) {
      const lastMessage =
        activeConversation.messages[activeConversation.messages.length - 1];
      recipientId =
        lastMessage.user_id === user.id
          ? lastMessage.to_user_id
          : lastMessage.user_id;
    }
    if (!recipientId) {
      const otherUserId = activeConversation.users?.find((u) => u !== user.id);
      if (otherUserId) {
        recipientId = otherUserId;
      } else {
        setError("Cannot determine message recipient");
        return;
      }
    }

    try {
      setError(null);

      const newMessage = await window.Messages.createMessage({
        conversationId: activeConversation.id,
        userId: user.id,
        toUserId: recipientId,
        type: "text",
        typeId: 0,
        metadata: {},
        text: text.trim(),
      });

      console.log("New message created:", newMessage);

      // Add message to current messages
      setMessages((prev) => [...prev, newMessage]);
      setConversationMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Failed to send message:", err);
      throw err;
    }
  };

  const startConversation = async (
    toUserId: number,
    text: string,
    type: string = "direct",
    typeId: number = 0,
    metadata: Record<string, any> = {}
  ) => {
    if (!user || !window.Messages) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Starting conversation with:', {
        toUserId,
        text,
        type,
        typeId,
        metadata,
        currentUserId: user.id
      });

      const startResponse = await window.Messages.startConversation({
        type,
        typeId,
        metadata,
        status: "active",
        userId: user.id,
        toUserId,
        text: text.trim(),
      });

      const { conversation, message } = startResponse;

      console.log('Conversation started successfully:', { conversation, message });

      // Add conversation to list
      const conversationWithMessages = {
        ...conversation,
        messages: [message],
        users: [user.id, toUserId], // Ensure users array is set
      };

      setConversations((prev) => [conversationWithMessages, ...prev]);

      // Set as active conversation
      setActiveConversationId(conversation.id);

      return conversation;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start conversation";
      setError(errorMessage);
      console.error("Failed to start conversation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (conversationId: number) => {
    // TODO: Implement read status when API supports it
    console.log("Mark as read:", conversationId);
  };

  useEffect(() => {
    setActiveConversation(
      conversations.find((conv) => conv.id === activeConversationId) || null
    );
  }, [activeConversationId]);

  // Fetch conversations when user changes
  useEffect(() => {
    if (user && window.Messages) {
      if (conversations.length === 0 && !loading) {
        fetchConversations();
      }
    } else {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
      setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveConversationId(null);
      setActiveConversation(null);
      setMessages([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Fetch messages when activeConversationId changes
  useEffect(() => {
    if (activeConversationId) {
      fetchSpecificConversation(activeConversationId);
    }
  }, [activeConversationId, fetchSpecificConversation]);

  const value: MessagingContextType = {
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    conversationMessages,
    unreadCount,
    loading,
    error,
    fetchConversations,
    setActiveConversationId,
    sendMessage,
    startConversation,
    markAsRead,
    clearError,
    fetchSpecificConversation,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};
