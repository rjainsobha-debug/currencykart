import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNumber(prefix = "CKFX") {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${date}-${entropy}`;
}
