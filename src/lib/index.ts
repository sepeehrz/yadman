import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export { apiClient } from "./api/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
