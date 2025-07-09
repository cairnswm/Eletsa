// Message API Response
export interface Message {
  id: number;
  conversationId: number;
  userId: number;
  toUserId: number;
  type: string;
  typeId: number;
  metadata: Record<string, any>;
  text: string;
  createdAt: string;
  updatedAt: string;
}

// Conversation API Response
export interface Conversation {
  id: number;
  applicationId: number;
  type: string;
  typeId: number;
  metadata: Record<string, any>;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[]; // Associated messages
}

// Application API Response
export interface Application {
  id: number;
  name: string;
  apiKey: string;
  ownerUserId: number;
  createdAt: string;
  updatedAt: string;
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
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Methods
  fetchConversations: () => Promise<void>;
  setActiveConversationId: (id: number | null) => void;
  sendMessage: (text: string, toUserId?: number) => Promise<void>;
  startConversation: (toUserId: number, text: string, type?: string, typeId?: number) => Promise<void>;
  markAsRead: (conversationId: number) => void;
  clearError: () => void;
}

// Global Messages API interface
declare global {
  interface Window {
    Messages: {
      setApiKey: (apiKey: string) => void;
      Messages: {
        get: (queryParams?: any) => Promise<Message[]>;
        create: (body: {
          conversationId: number;
          userId: number;
          toUserId: number;
          type: string;
          typeId: number;
          metadata: Record<string, any>;
          text: string;
        }) => Promise<Message>;
        update: (id: number, body: any) => Promise<Message>;
        delete: (id: number) => Promise<void>;
      };
      Conversations: {
        get: (queryParams?: any) => Promise<Conversation[]>;
        create: (body: {
          applicationId: number;
          type: string;
          typeId: number;
          metadata: Record<string, any>;
          status: string;
        }) => Promise<Conversation>;
        update: (id: number, body: any) => Promise<Conversation>;
        delete: (id: number) => Promise<void>;
      };
      Applications: {
        get: (queryParams?: any) => Promise<Application[]>;
        create: (body: any) => Promise<Application>;
        update: (id: number, body: any) => Promise<Application>;
        delete: (id: number) => Promise<void>;
      };
      Conv: {
        get: (userId: number) => Promise<Conversation[]>;
      };
      Start: {
        create: (body: {
          type: string;
          typeId: number;
          metadata: Record<string, any>;
          status: string;
          userId: number;
          toUserId: number;
          text: string;
        }) => Promise<StartResponse>;
      };
    };
  }
}