import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------- TAILWIND MERGE -------------------- */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------- USER TYPE -------------------- */

export type User = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
};

/* -------------------- GET USER -------------------- */

export const getUser = (): User | null => {
  try {
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
  localStorage.setItem("user", JSON.stringify(user));
};

/* -------------------- LOGOUT -------------------- */

export const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/* -------------------- IS AUTH -------------------- */

export const isAuthenticated = () => {
  const user = getUser();
  return !!user?.id;
};
