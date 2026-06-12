import { api } from "./client";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: Record<string, unknown> | null;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  unread_count: number;
}

export const notificationsApi = {
  list() {
    return api.get<NotificationsResponse>("notifications");
  },

  markRead(id: string) {
    return api.post<{ success: boolean }>("notifications/read", { notification_id: id });
  },

  markAllRead() {
    return api.post<{ success: boolean }>("notifications/read-all", {});
  },

  registerPushToken(token: string, platform: "ios" | "android") {
    return api.post<{ success: boolean }>("notifications/push-token", { token, platform });
  },
};

// ─── Opportunities API (creator-side) ────────────────────────────────────────
export interface Opportunity {
  id: string;
  invite_id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string | null;
  project_status: string;
  invite_status: string;
  booking_type: string | null;
  booking_location: string | null;
  event_date: string | null;
  estimated_days: number | null;
  budget: number | null;
  requirement_summary: string | null;
  match_reason: string | null;
  response_note: string | null;
  viewed_at: string | null;
  responded_at: string | null;
  created_at?: string;
}

export interface OpportunitiesResponse {
  success: boolean;
  opportunities: Opportunity[];
}

export const opportunitiesApi = {
  list() {
    return api.get<OpportunitiesResponse>("opportunities");
  },

  get(projectId: string) {
    return api.get<{ success: boolean; opportunity: Opportunity }>(`opportunities/${projectId}`);
  },

  accept(projectId: string, inviteId: string, data?: { responseNote?: string; availabilityNote?: string }) {
    return api.post<{ success: boolean; message: string }>(`opportunities/${projectId}/accept`, {
      invite_id: inviteId,
      response_note: data?.responseNote,
      availability_note: data?.availabilityNote,
    });
  },

  reject(projectId: string, inviteId: string, data?: { responseNote?: string }) {
    return api.post<{ success: boolean; message: string }>(`opportunities/${projectId}/reject`, {
      invite_id: inviteId,
      response_note: data?.responseNote,
    });
  },

  submitQuote(projectId: string, data: { amount: number; note?: string }) {
    return api.post<{ success: boolean; message: string }>(`opportunities/${projectId}/quote`, data);
  },
};
