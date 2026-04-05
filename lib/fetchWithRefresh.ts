import "server-only";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export const fetchWithRefresh = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const makeRequest = async () =>
    fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Cookie: cookieHeader,
      },
    });

  let res = await makeRequest();

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

    res = await makeRequest();
  }

  return res.json();
};
