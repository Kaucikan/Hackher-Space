import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------- AUTH -------------------- */
type User = {
  id: string;
  name?: string;
};

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
