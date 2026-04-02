import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5000/api/v1";

export const fetchWithRefresh = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  // NEW: forward browser cookies to backend
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const makeRequest = async () =>
    fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Cookie: cookieHeader, // forward cookies
      },
    });

  let res = await makeRequest();

  // NEW: if 401 → refresh → retry once
  if (res.status === 401) {
    const refresh = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    });

    // refresh failed → session truly expired
    if (!refresh.ok) {
      return {
        success: false,
        message: "Session expired. Please login again.",
        data: null,
      };
    }

    // retry original request
    res = await makeRequest();
  }

  return res.json();
};