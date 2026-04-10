import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------- CN (TAILWIND MERGE) -------------------- */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------- USER TYPE -------------------- */

export type User = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  token?: string;
};

/* -------------------- GET USER -------------------- */

export const getUser = (): User | null => {
  try {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem("user");
    if (!data) return null;

    const parsed = JSON.parse(data);

    if (!parsed || typeof parsed !== "object" || !parsed.id) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

/* -------------------- SET USER -------------------- */

export const setUser = (user: User) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
};

/* -------------------- LOGOUT -------------------- */

export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");

  // soft redirect
  window.location.replace("/login");
};

/* -------------------- IS AUTHENTICATED -------------------- */

export const isAuthenticated = () => {
  const user = getUser();
  return Boolean(user?.id);
};

/* -------------------- GET USER ID -------------------- */

export const getUserId = () => {
  const user = getUser();
  return user?.id || null;
};
