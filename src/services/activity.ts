import { createHeaders, handleApiResponse } from "./api";
import { ActivityItem } from "../types/activity";

const ACTIVITY_API = "https://eletsa.cairns.co.za/php/activity";

interface ActivityResponse {
  id: string | number;
  user_id: string | number;
  activity_type: string;
  reference_id_1: string | number | null;
  reference_id_2: string | number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  template_id: string | number;
  template_text: string;
  followed_user_id: string | number | null;
  event_title: string | null;
  event_date: string | null;
  review_rating: string | number | null;
  review_snippet: string | null;
  ticket_type_name: string | null;
  ticket_quantity: string | number | null;
  total_reactions: string | number;
  reaction_breakdown: Record<string, number> | null;
  total_comments: string | number;
  has_liked: 0 | 1;
  modified_at: string;
}

export const activityApi = {
  async fetchUserActivityFeed(userId: number): Promise<ActivityItem[]> {
    const response = await fetch(`${ACTIVITY_API}/api.php/user/${userId}/wall`, {
      method: "GET",
      headers: {
        ...createHeaders(true),
        'Accept': 'application/json',
      },
    });

    const data = await handleApiResponse(response);
    const activities = Array.isArray(data) ? data : [data];

    // Convert string numbers to proper types where needed
    return activities.map((activity: ActivityResponse) => ({
      ...activity,
      id: Number(activity.id),
      user_id: Number(activity.user_id),
      reference_id_1: activity.reference_id_1 ? Number(activity.reference_id_1) : null,
      reference_id_2: activity.reference_id_2 ? Number(activity.reference_id_2) : null,
      template_id: Number(activity.template_id),
      followed_user_id: activity.followed_user_id ? Number(activity.followed_user_id) : null,
      review_rating: activity.review_rating ? Number(activity.review_rating) : null,
      total_reactions: Number(activity.total_reactions),
      total_comments: Number(activity.total_comments),
      ticket_quantity: activity.ticket_quantity ? Number(activity.ticket_quantity) : null,
    }));
  },

  async likeActivity(activityId: number, userId: number): Promise<void> {
    const response = await fetch(`${ACTIVITY_API}/api.php/activityReaction`, {
      method: "POST",
      headers: {
        ...createHeaders(true),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activity_id: activityId,
        reaction_type: "like",
        user_id: userId
      }),
    });

    await handleApiResponse(response);
  },

  async unlikeActivity(activityId: number, userId: number): Promise<void> {
    const response = await fetch(`${ACTIVITY_API}/api.php/activityReaction`, {
      method: "POST",
      headers: {
        ...createHeaders(true),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activity_id: activityId,
        reaction_type: "unlike",
        user_id: userId
      }),
    });

    await handleApiResponse(response);
  },
};