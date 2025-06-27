export interface User {
  id: string;
  username: string;
  name: string;
  role: string; // Updated to string to match data
  email: string;
  bio?: string;
  phone?: string;
  credits?: number; // Made optional to match data inconsistencies
  fee: number;
  verified: boolean;
  password: string;
  image?: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  timestamp: string;
}

export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isOrganizer: boolean;
  isAdmin: boolean;
  isAttendee: boolean;
  updateUser: (updates: Partial<User>) => void;
  toggleFollow: (targetUserId: string) => void;
  isFollowing: (targetUserId: string) => boolean;
  getFollowers: (userId: string) => User[];
  getFollowing: (userId: string) => User[];
  isFollowMutual: (userId: string, targetUserId: string) => boolean;
  checkVerificationStatus: (userId: string) => boolean;
  updateVerificationStatus: (userId: string) => void;
  calculateNetRevenue: (grossRevenue: number, userId: string) => number;
  getPlatformFee: (grossRevenue: number, userId: string) => number;
  getUserById: (userId: string) => User | undefined; // Added to UserContextType
}

export interface Organizer {
  id: string;
  name: string;
  bio: string;
  eventCount: number;
  averageRating: number;
  testimonials: number[];
  avatar?: string;
}
