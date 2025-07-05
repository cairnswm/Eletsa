export interface UserProfile {
  id: number;
  email: string;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  role: string | null;
  app_id: string;
  created_at: string;
  modified_at: string;
}

export interface FollowRelation {
  id: number;
  follower_user_id: number;
  followed_user_id: number;
  created_at: string;
  modified_at: string;
}

export interface UserContextType {
  users: UserProfile[];
  followRelations: FollowRelation[];
  loading: boolean;
  error: string | null;
  fetchUser: (userId: number) => Promise<UserProfile>;
  getUser: (userId: number) => UserProfile | null;
  isFollowing: (followerUserId: number, followedUserId: number) => boolean;
  isFollowedBy: (userId: number, followerId: number) => boolean;
  getFollowRelation: (followerUserId: number, followedUserId: number) => FollowRelation | null;
  getFollowers: (userId: number) => FollowRelation[];
  getFollowing: (userId: number) => FollowRelation[];
  followUser: (followerUserId: number, followedUserId: number) => Promise<void>;
  unfollowUser: (followerUserId: number, followedUserId: number) => Promise<void>;
  fetchUserFollows: (userId: number) => Promise<void>;
  fetchUserFollowers: (userId: number) => Promise<void>;
  fetchBulkUsersFromRelations: (relations: FollowRelation[]) => Promise<void>;
  clearError: () => void;
}