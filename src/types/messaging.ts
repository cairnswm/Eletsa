// Message API Response
export interface Message {
  id: number;
  conversation_id: number;
  user_id: number;
  to_user_id: number;
  type: string;
  type_id: number;
  metadata: Record<string, any>;
  text: string;
  created_at: string;
  updated_at: string;
}

// Conversation API Response
export interface Conversation {
  id: number;
  application_id: number;
  type: string;
  type_id: number;
  metadata: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
  messages: Message[]; // Associated messages
  users: number[]; // List of user IDs in the conversation
  unread_messages?: number; // Number of unread messages in this conversation
}

// Application API Response
export interface Application {
  id: number;
  name: string;
  apiKey: string;
  owner_user_id: number;
  created_at: string;
  updated_at: string;
}

// Start API Response
export interface StartResponse {
  conversation: Conversation;
  message: Message;
}

// General API Error Response
export interface ApiError {
  error: string;
  message: string;
}

export interface MessagingContextType {
  conversations: Conversation[];
  activeConversationId: number | null;
  activeConversation: Conversation | null;
  messages: Message[];
  conversationMessages: Message[]; // Added conversationMessages
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Methods
  fetchConversations: () => Promise<void>;
  setActiveConversationId: (id: number | null) => void;
  sendMessage: (text: string, toUserId?: number) => Promise<void>;
  startConversation: (toUserId: number, text: string, type?: string, typeId?: number, metadata?: Record<string, any>) => Promise<Conversation | undefined>;
  markAsRead: (conversationId: number, messageId?: number) => void;
  clearError: () => void;
  fetchSpecificConversation: (conversationId: number) => Promise<void>;
}

// Global Messages API interface
declare global {
  interface Window {
    Messages: {
      setApiKey: (apiKey: string) => void;
      getMessages: (id: number) => Promise<Message[]>;
      createMessage: (body: {
        conversationId: number;
        userId: number;
        toUserId: number;
        type: string;
        typeId: number;
        metadata: Record<string, unknown>;
        text: string;
      }) => Promise<Message>;
      updateMessage: (id: number, body: {
        type: string;
        typeId: number;
        metadata: Record<string, unknown>;
        text: string;
      }) => Promise<Message>;
      deleteMessage: (id: number) => Promise<void>;
      getConversations: (id: number) => Promise<Conversation>;
      createConversation: (body: {
        applicationId: number;
        type: string;
        typeId: number;
        metadata: Record<string, unknown>;
        status: string;
      }) => Promise<Conversation>;
      updateConversation: (id: number, body: {
        type: string;
        typeId: number;
        metadata: Record<string, unknown>;
      }) => Promise<Conversation>;
      deleteConversation: (id: number) => Promise<void>;
      getApplications: (id: number) => Promise<Application>;
      createApplication: (body: {
        name: string;
        apiKey: string;
        ownerUserId: number;
      }) => Promise<Application>;
      updateApplication: (id: number, body: {
        name: string;
        apiKey: string;
        ownerUserId: number;
      }) => Promise<Application>;
      deleteApplication: (id: number) => Promise<void>;
      getConv: (userId: number) => Promise<Conversation[]>;
      startConversation: (body: {
        type: string;
        typeId: number;
        metadata: Record<string, unknown>;
        status: string;
        userId: number;
        toUserId: number;
        text: string;
      }) => Promise<StartResponse>;
      markMessagesRead: (
        userId: number,
        conversationId: number,
        lastReadMessageId: number,
        recordId?: number
      ) => Promise<void>;
    };
  }
}