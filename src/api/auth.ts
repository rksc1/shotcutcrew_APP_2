import { api } from "./client";

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    account_type: string;
    verified: boolean;
    parichay_verified: boolean;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    account_type: string;
    verified: boolean;
    parichay_verified: boolean;
    profile_image_url?: string | null;
    city?: string | null;
    bio?: string | null;
  };
  creator?: {
    id: string;
    role: string;
    city: string | null;
    day_rate: number | null;
    verified: boolean;
    parichay_verified: boolean;
    profile_image_url: string | null;
    available_for_booking: boolean;
  } | null;
}

export const authApi = {
  login(email: string, password: string) {
    return api.post<LoginResponse>("auth/login", { email, password }, false);
  },

  signupClient(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return api.post<SignupResponse>("auth/signup", { ...data, account_type: "client" }, false);
  },

  signupCreator(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    city: string;
    creatorType: string;
    dayRate: number;
    state?: string;
    whatsapp_phone?: string;
  }) {
    return api.post<SignupResponse>("auth/signup", {
      ...data,
      account_type: "creator",
      creator_type: data.creatorType,
      day_rate: data.dayRate,
    }, false);
  },

  forgotPassword(email: string) {
    return api.post<SignupResponse>("auth/forgot-password", { email }, false);
  },

  resendVerification(email: string) {
    return api.post<SignupResponse>("auth/resend-verification", { email }, false);
  },

  getProfile() {
    return api.get<ProfileResponse>("profile");
  },

  updateProfile(data: {
    fullName?: string;
    phone?: string;
    city?: string;
    bio?: string;
    dayRate?: number;
  }) {
    return api.post<{ success: boolean; message: string }>("profile/update", data);
  },

  deleteAccount() {
    return api.post<{ success: boolean; message: string }>("profile/delete-account", {});
  },
};
