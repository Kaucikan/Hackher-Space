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
    throw new Error("User Not Logged In");
  }

  let url = `${API}${path}`;

  // attach userId to query
  if (requireUser && user?.id) {
    const sep = url.includes("?") ? "&" : "?";
    url = `${url}${sep}userId=${user.id}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    // auto logout if unauthorized
    if (res.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    // handle server error
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "API Error");
    }

    return res;
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err;
  }
};
