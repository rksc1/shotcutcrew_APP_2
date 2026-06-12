import { api } from "./client";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  payment_status: string | null;
  booking_type: string | null;
  booking_location: string | null;
  event_date: string | null;
  estimated_days: number | null;
  budget: number | null;
  requirement_summary: string | null;
  selected_creator_id: string | null;
  parichay_coordinator_id: string | null;
  created_at?: string;
}

export interface ProjectsListResponse {
  success: boolean;
  projects: Project[];
}

export interface ProjectDetailResponse {
  success: boolean;
  project: Project;
  timeline?: TimelineEntry[];
  messages?: Message[];
}

export interface TimelineEntry {
  id: string;
  status: string;
  note: string | null;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string | null;
  message: string;
  created_at: string;
}

export interface QrPaymentResponse {
  success: boolean;
  payment: {
    payment_id: string;
    payment_status: string;
    payment_reference: string | null;
    payment_proof_url: string | null;
    verification_note: string | null;
    qrPayload: string;
    amount: number;
    upiId: string;
    payeeName: string;
    transactionNote: string;
  };
}

export const projectsApi = {
  list() {
    return api.get<ProjectsListResponse>("projects");
  },

  get(id: string) {
    return api.get<ProjectDetailResponse>(`projects/${id}`);
  },

  getTimeline(id: string) {
    return api.get<{ success: boolean; timeline: TimelineEntry[] }>(`projects/${id}/timeline`);
  },

  getMessages(id: string) {
    return api.get<{ success: boolean; messages: Message[] }>(`projects/${id}/messages`);
  },

  sendMessage(id: string, message: string) {
    return api.post<{ success: boolean; message: string }>(`projects/${id}/messages`, { message });
  },

  getQrPayment(id: string) {
    return api.get<QrPaymentResponse>(`projects/${id}/qr-payment`);
  },

  uploadPaymentProof(id: string, formData: FormData) {
    return api.postForm<{ success: boolean; proofUrl: string }>(
      `projects/${id}/payment-proof`,
      formData,
    );
  },

  submitPaymentProof(id: string, data: { paymentReference: string; proofUrl?: string }) {
    return api.post<{ success: boolean; message: string }>(
      `projects/${id}/payment-proof/submit`,
      data,
    );
  },

  uploadWorkProof(id: string, formData: FormData) {
    return api.postForm<{ success: boolean; message: string; proofUrl: string }>(
      `projects/${id}/work-proof`,
      formData,
    );
  },

  cancel(id: string, reason?: string) {
    return api.post<{ success: boolean; message: string }>(`projects/${id}/cancel`, { reason });
  },

  approve(id: string) {
    return api.post<{ success: boolean; message: string }>(`projects/${id}/approve`, {});
  },
};
