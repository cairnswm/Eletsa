export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  eventId: string | null;
  timestamp: string;
  message: string;
}

export interface Conversation {
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
