import { api } from "./client";

export interface Creator {
  id: string;
  slug?: string | null;
  full_name: string | null;
  role: string | null;
  city: string | null;
  location: string | null;
  day_rate: number | null;
  verified: boolean;
  parichay_verified: boolean;
  profile_image_url: string | null;
  cover_image_url?: string | null;
  bio?: string | null;
  rating?: number | null;
  completed_projects?: number | null;
  available_for_booking: boolean;
  service_tags?: string[] | null;
  creator_type?: string | null;
}

export interface CreatorProfile extends Creator {
  portfolio_items?: PortfolioItem[];
  trust_badges?: string[];
}

export interface PortfolioItem {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  title?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  display_order: number;
}

export interface CreatorsListResponse {
  success: boolean;
  creators: Creator[];
  total?: number;
}

export interface CreatorProfileResponse {
  success: boolean;
  creator: CreatorProfile;
}

export const creatorsApi = {
  list(params?: {
    city?: string;
    role?: string;
    verified?: boolean;
    parichay_verified?: boolean;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.city) query.set("city", params.city);
    if (params?.role) query.set("role", params.role);
    if (params?.verified) query.set("verified", "true");
    if (params?.parichay_verified) query.set("parichay_verified", "true");
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return api.get<CreatorsListResponse>(`creators${qs ? `?${qs}` : ""}`);
  },

  getProfile(id: string) {
    return api.get<CreatorProfileResponse>(`creators/${id}`);
  },

  getFeatured() {
    return api.get<CreatorsListResponse>("creators?verified=true&limit=10");
  },

  search(query: string, params?: { city?: string; role?: string }) {
    const qs = new URLSearchParams({ q: query });
    if (params?.city) qs.set("city", params.city);
    if (params?.role) qs.set("role", params.role);
    return api.get<CreatorsListResponse>(`creators/search?${qs.toString()}`);
  },

  getPortfolio(creatorId: string) {
    return api.get<{ success: boolean; items: PortfolioItem[] }>(`portfolio/${creatorId}`);
  },
};
