export type UserRole = "creator" | "earner";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  created_at: string;
}

export interface Campaign {
  id: string;
  creator_id: string;
  youtube_url: string;
  youtube_video_id: string;
  title: string;
  description: string | null;
  target_views: number;
  current_views: number;
  budget_rwf: number;
  cost_per_view_rwf: number;
  status: "pending" | "active" | "completed" | "paused";
  created_at: string;
  profiles?: { full_name: string };
}

export interface WatchSession {
  id: string;
  earner_id: string;
  campaign_id: string;
  watch_duration_seconds: number;
  completed: boolean;
  earned_rwf: number;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance_rwf: number;
  total_earned_rwf: number;
  total_withdrawn_rwf: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "earn" | "deposit" | "withdrawal";
  amount_rwf: number;
  description: string | null;
  created_at: string;
}
