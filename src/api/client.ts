import { getToken } from "@/utils/storage";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://shotcutcrew.com";
const MOBILE_PREFIX = "/api/mobile";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function buildHeaders(authenticated: boolean): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept":        "application/json",
  };
  if (authenticated) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  path: string,
  options: RequestInit & { authenticated?: boolean } = {},
): Promise<T> {
  const { authenticated = true, ...fetchOptions } = options;
  const url = `${API_BASE}${MOBILE_PREFIX}/${path.replace(/^\//, "")}`;
  const headers = await buildHeaders(authenticated);

  const response = await fetch(url, {
    ...fetchOptions,
    headers: { ...headers, ...(fetchOptions.headers as Record<string, string> ?? {}) },
  });

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const msg =
      (json as { message?: string; error?: string } | null)?.message ||
      (json as { error?: string } | null)?.error ||
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, msg, json);
  }

  return json as T;
}

export const api = {
  get<T>(path: string, authenticated = true): Promise<T> {
    return request<T>(path, { method: "GET", authenticated });
  },

  post<T>(path: string, body: unknown, authenticated = true): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      authenticated,
    });
  },

  patch<T>(path: string, body: unknown, authenticated = true): Promise<T> {
    return request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      authenticated,
    });
  },

  delete<T>(path: string, authenticated = true): Promise<T> {
    return request<T>(path, { method: "DELETE", authenticated });
  },

  async postForm<T>(path: string, formData: FormData, authenticated = true): Promise<T> {
    const url = `${API_BASE}${MOBILE_PREFIX}/${path.replace(/^\//, "")}`;
    const headers: Record<string, string> = {};
    if (authenticated) {
      const token = await getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers,
    });
    let json: unknown;
    try {
      json = await response.json();
    } catch {
      json = null;
    }
    if (!response.ok) {
      const msg =
        (json as { message?: string } | null)?.message ?? `Upload failed (${response.status})`;
      throw new ApiError(response.status, msg, json);
    }
    return json as T;
  },
};
