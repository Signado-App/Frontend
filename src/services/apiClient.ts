import { ApiErrorShape } from "@/types/types";
import axios, { AxiosError } from "axios";

export function isApiError(err: unknown): err is ApiErrorShape {
  return (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    typeof (err as Record<string, unknown>).type === "string"
  );
}

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

const AUTH_BYPASS_ENDPOINTS = ["/auth/login", "/auth/register"];

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Network error
    if (!error.response) {
      const apiError: ApiErrorShape = {
        type: "NETWORK_ERROR",
        status: null,
        message: "Cannot connect to server. Check your internet connection.",
        data: null,
      };
      return Promise.reject(apiError);
    }

    const { status, data } = error.response;
    const url = error.config?.url ?? "";
    const isBypassed = AUTH_BYPASS_ENDPOINTS.some((p) => url.endsWith(p));

    // 401 - session expired (auth different)
    if (status === 401 && !isBypassed) {
      onUnauthorized?.();
      const apiError: ApiErrorShape = {
        type: "UNAUTHORIZED",
        status: 401,
        message: "Session expired. Please log in again.",
        data,
      };
      return Promise.reject(apiError);
    }

    // 5xx - server error
    if (status >= 500) {
      const apiError: ApiErrorShape = {
        type: "SERVER_ERROR",
        status,
        message: "Something went wrong. Please try again later.",
        data,
      };
      return Promise.reject(apiError);
    }

    // (400, 403, 404, 409, 422...)
    const apiError: ApiErrorShape = {
      type: "API_ERROR",
      status,
      message: data?.message ?? "An error occurred",
      data,
    };
    return Promise.reject(apiError);
  },
);
apiClient.interceptors.request.use((config) => {
  const accessCsrf =
    getCookie("csrf_access_token") ?? localStorage.getItem("access_csrf");
  if (accessCsrf) {
    config.headers["X-CSRF-TOKEN"] = accessCsrf;
  }
  return config;
});

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
export default apiClient;
