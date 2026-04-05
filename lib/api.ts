const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export const api = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const makeRequest = async (token: string | null) =>
    fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

  let res = await makeRequest(accessToken);

  if (res.status === 401) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; path=/; max-age=0";
      window.location.href = "/";
      return { success: false, message: "Session expired" };
    }

    const refreshData = await refreshRes.json();
    const newAccessToken = refreshData.accessToken;

    // NEW: update both localStorage and cookie
    localStorage.setItem("accessToken", newAccessToken);
    document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${15 * 60}`;

    res = await makeRequest(newAccessToken);
  }

  return res.json();
};