import { AuthResponse, RefreshResponse, User } from "../types/auth.js";
import { useAuthStore } from "../stores/authStore.js";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const message = errorJson?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export async function registerApi(data: {
  username: string;
  email: string;
  password: string;
  displayName: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return parseResponse<AuthResponse>(res);
}

export async function loginApi(data: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return parseResponse<AuthResponse>(res);
}

export async function refreshApi(): Promise<RefreshResponse> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return parseResponse<RefreshResponse>(res);
}

export async function logoutApi(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchMeApi(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse<User>(res);
}

export async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const store = useAuthStore.getState();
  let token = store.accessToken;

  if (!token) {
    const refreshData = await refreshApi();
    token = refreshData.accessToken;
    store.setAccessToken(token);
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshData = await refreshApi();
    token = refreshData.accessToken;
    store.setAccessToken(token);

    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }

  return parseResponse<T>(res);
}
