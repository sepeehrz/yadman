import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status: number;
  /** مسیر نسبی درخواست — برای تشخیص خطاهای مربوط به نشست */
  url?: string;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status ?? 0;
    const message =
      axiosError.response?.data?.message ??
      axiosError.message ??
      "خطای ارتباط با سرور";
    return { message, status, url: axiosError.config?.url };
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }
  return { message: "خطای ناشناخته", status: 0 };
}

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);
