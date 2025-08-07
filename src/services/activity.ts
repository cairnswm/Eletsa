import { createHeaders, handleApiResponse } from "./api";
import { ActivityItem } from "../types/activity";

const ACTIVITY_API = "https://eletsa.cairns.co.za/php/activity";

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
    return activities.map((activity: any) => ({
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
    }));
  },
};