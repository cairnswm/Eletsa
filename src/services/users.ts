import { createHeaders, handleApiResponse } from './api';

const USERS_API = 'https://eletsa.cairns.co.za/php/cairnsgames';
const FOLLOW_API = 'https://eletsa.cairns.co.za/php/follow';

export interface FollowRelation {
  id: number;
  follower_user_id: number;
  followed_user_id: number;
  created_at: string;
  modified_at: string;
}

export const usersApi = {
  async fetchUser(userId: number) {
    const response = await fetch(`${USERS_API}/user.php/${userId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return data;
  },

  // Bulk fetch multiple users
  async fetchBulkUsers(userIds: number[]) {
    if (userIds.length === 0) {
      return [];
    }

    const response = await fetch(`${USERS_API}/bulk.php`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ users: userIds }),
    });

    const data = await handleApiResponse(response);
    return Array.isArray(data) ? data : [data];
  },

  // Get users that follow this user (followers)
  async getUserFollowers(userId: number): Promise<FollowRelation[]> {
    const response = await fetch(`${FOLLOW_API}/api.php/user/${userId}/followed`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return Array.isArray(data) ? data : [data];
  },

  // Get users that this user follows
  async getUserFollows(userId: number): Promise<FollowRelation[]> {
    const response = await fetch(`${FOLLOW_API}/api.php/user/${userId}/follows`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return Array.isArray(data) ? data : [data];
  },

  // Follow a user
  async followUser(followerUserId: number, followedUserId: number): Promise<FollowRelation> {
    const response = await fetch(`${FOLLOW_API}/api.php/followers`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({
        follower_user_id: followerUserId,
        followed_user_id: followedUserId,
      }),
    });

    const data = await handleApiResponse(response);
    
    // Handle the case where API returns an array (as you mentioned)
    const followRelation = Array.isArray(data) ? data[0] : data;
    
    console.log('Follow API response:', data);
    console.log('Processed follow relation:', followRelation);
    
    return followRelation;
  },

  // Unfollow a user
  async unfollowUser(followId: number): Promise<void> {
    const response = await fetch(`${FOLLOW_API}/api.php/followers/${followId}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    await handleApiResponse(response);
  },
};