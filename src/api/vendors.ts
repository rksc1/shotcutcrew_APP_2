import { api } from "./client";

export interface Vendor {
  id: string;
  business_name: string;
  city: string;
  rating: number;
  verified: boolean;
  parichay_verified: boolean;
  cover_image_url: string | null;
  profile_image_url: string | null;
  bio: string | null;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  daily_rate: number;
  available: boolean;
}

export const vendorsApi = {
  list() {
    return api.get<{ success: boolean; vendors: Vendor[] }>("vendors");
  },
  get(id: string) {
    return api.get<{ success: boolean; vendor: Vendor; inventory: InventoryItem[] }>(`vendors/${id}`);
  },
};
