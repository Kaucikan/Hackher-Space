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

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  requireUser = false,
) => {
  const user = getUser();

  // 🔥 if API needs userId
  if (requireUser && !user?.id) {
    throw new Error("User not logged in");
  }

  // 🔥 attach userId automatically
  let finalUrl = url;
  if (user?.id) {
    const separator = url.includes("?") ? "&" : "?";
    finalUrl = `${url}${separator}userId=${user.id}`;
  }

  return fetch(finalUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};
