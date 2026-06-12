import { api } from "./client";

export interface BookingPayload {
  title: string;
  description: string;
  bookingType: string;
  bookingLocation: string | null;
  eventDate: string | null;
  estimatedDays: number;
  budget: number;
  requirementSummary: string;
  // Extended fields for quick booking
  crewRequirements?: Record<string, number>;
  equipmentRequirements?: Record<string, boolean>;
  postProductionServices?: string[];
  setupType?: string;
  budgetTier?: string;
  customEventType?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  project_id: string;
  match_count: number;
}

export interface SelectionResponse {
  success: boolean;
  message: string;
  project: {
    id: string;
    title: string;
    status: string | null;
    selected_creator_id: string | null;
  };
  creators: InterestedCreator[];
}

export interface InterestedCreator {
  invite_id: string;
  creator_id: string;
  name: string;
  full_name: string;
  role: string | null;
  city: string | null;
  day_rate: number | null;
  verified: boolean | null;
  profile_image_url: string | null;
  response_note: string | null;
  availability_note: string | null;
  responded_at: string | null;
  invite_status: string;
  match_reason: string | null;
  match_score: number | null;
}

export const bookingsApi = {
  create(payload: BookingPayload) {
    return api.post<CreateBookingResponse>("bookings", payload);
  },

  getSelection(projectId: string) {
    return api.get<SelectionResponse>(`projects/${projectId}/selection`);
  },

  shortlistCreator(projectId: string, inviteId: string) {
    return api.post<{ success: boolean; message: string }>(
      `projects/${projectId}/selection/shortlist`,
      { inviteId },
    );
  },

  selectCreator(projectId: string, inviteId: string) {
    return api.post<{ success: boolean; message: string }>(
      `projects/${projectId}/selection/select`,
      { inviteId },
    );
  },
};
