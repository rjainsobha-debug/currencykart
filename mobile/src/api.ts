import Constants from "expo-constants";
import { getSession } from "./storage";
import type { OrderType } from "./types";

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
export const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? extra?.apiBaseUrl ?? "https://staging.currencykart.in";

type ApiOptions = RequestInit & { auth?: boolean };

export class ApiClientError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const session = await getSession();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.auth && session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload?.error;
    throw new ApiClientError(error?.message ?? "Request failed.", response.status, error?.code);
  }
  return payload as T;
}

export function requestOtp(phone: string) {
  return apiFetch<{ challengeId: string; expiresAt?: string }>("/api/auth/otp", {
    method: "POST",
    body: JSON.stringify({ phone })
  });
}

export function verifyOtp(phone: string, code: string, challengeId: string) {
  return apiFetch<{ verified: boolean; challengeId: string }>("/api/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, code, challengeId })
  });
}

export function registerCustomer(input: { name: string; email: string; phone: string; password: string }) {
  return apiFetch<{ user: unknown }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function submitOrder(input: {
  type: OrderType;
  currencyCode: string;
  amount: number;
  purpose: string;
  destinationCountry?: string;
  travelDate?: string;
  deliveryAddress?: string;
}) {
  return apiFetch<{ order: unknown; complianceNote?: string }>("/api/orders", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input)
  });
}

export function getOrders() {
  return apiFetch<{ orders: unknown[] }>("/api/orders", { auth: true });
}

export function getOrder(orderId: string) {
  return apiFetch<{ order: unknown; checklist?: unknown; rateLock?: unknown }>(`/api/orders/${orderId}`, { auth: true });
}

export function getDocumentChecklist(orderType: OrderType, purpose: string) {
  return apiFetch<{ checklist: string[] }>(`/api/document-checklist?orderType=${orderType}&purpose=${encodeURIComponent(purpose)}`);
}

export function requestUploadPlaceholder(input: { type: string; fileName: string; mimeType: string; size: number; orderId?: string }) {
  return apiFetch<{ upload: unknown }>("/api/upload", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input)
  });
}
