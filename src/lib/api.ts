export const getUser = () => {
  try {
    const data = localStorage.getItem("user");
    if (!data) return null;

    const parsed = JSON.parse(data);
    return parsed?.id ? parsed : null;
  } catch {
    return null;
  }
};

const API = import.meta.env.VITE_API || "https://hackher-space-be.onrender.com";

export const apiFetch = async (
  path: string,
  options: RequestInit = {},
  requireUser = false,
) => {
  const user = getUser();

  if (requireUser && !user?.id) {
    throw new Error("User not logged in");
  }

  let url = `${API}${path}`;

  // attach userId only if required
  if (requireUser && user?.id) {
    const sep = url.includes("?") ? "&" : "?";
    url = `${url}${sep}userId=${user.id}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
};
