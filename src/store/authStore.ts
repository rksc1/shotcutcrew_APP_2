import { create } from "zustand";
import { authApi } from "@/api/auth";
import { saveToken, getToken, clearAllStorage } from "@/utils/storage";

export type AccountType =
  | "client"
  | "creator"
  | "vendor"
  | "parichay_coordinator"
  | "admin"
  | null;

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  account_type: AccountType;
  verified: boolean;
  parichay_verified: boolean;
  profile_image_url?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const token = await getToken();
      if (token) {
        // Validate token by fetching profile
        const { user, creator } = await authApi.getProfile();
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          account_type: user.account_type as AccountType,
          verified: user.verified || creator?.verified || false,
          parichay_verified: user.parichay_verified || creator?.parichay_verified || false,
          profile_image_url: user.profile_image_url || creator?.profile_image_url,
        };
        set({ user: authUser, token, isLoading: false, isInitialized: true });
      } else {
        set({ isLoading: false, isInitialized: true });
      }
    } catch {
      // Token invalid or expired — clear and start fresh
      await clearAllStorage();
      set({ user: null, token: null, isLoading: false, isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(email, password);
      const authUser: AuthUser = {
        id: response.user.id,
        email: response.user.email,
        full_name: response.user.full_name,
        account_type: response.user.account_type as AccountType,
        verified: response.user.verified,
        parichay_verified: response.user.parichay_verified,
      };
      await saveToken(response.token);
      set({ user: authUser, token: response.token, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await clearAllStorage();
    set({ user: null, token: null });
  },

  updateUser: (updates) => {
    const current = get().user;
    if (current) set({ user: { ...current, ...updates } });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
