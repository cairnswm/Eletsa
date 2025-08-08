export interface ActivityItem {
  id: number;
  user_id: number;
  activity_type: string;
  reference_id_1: number | null;
  reference_id_2: number | null;
  metadata: Record<string, any> | null;
  created_at: string;
  template_id: number;
  template_text: string;
  followed_user_id: number | null;
  event_title: string | null;
  event_date: string | null;
  review_rating: number | null;
  review_snippet: string | null;
  ticket_type_name: string | null;
  ticket_quantity: number | null;
  total_reactions: number;
  reaction_breakdown: Record<string, number> | null;
  total_comments: number;
}

export interface ActivityContextType {
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
  fetchActivities: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  clearError: () => void;
}