"use server";
import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

const BASE_URL = "http://localhost:5000/api/v1";

// login does not use fetchWithRefresh — no cookie yet
export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return res.json();
  } catch (error) {
    return { success: false, message: "Network error", data: null };
  }
};

// register does not need cookie either
export const register = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  } catch (error) {
    return { success: false, message: "Network error", data: null };
  }
};

// logout and getMe use fetchWithRefresh — need cookie
export const logout = async () => {
  try {
    return await fetchWithRefresh("/auth/logout", { method: "POST" });
  } catch (error) {
    return { success: false, message: "Network error", data: null };
  }
};

export const getMe = async () => {
  try {
    return await fetchWithRefresh("/auth/me");
  } catch (error) {
    return { success: false, message: "Network error", data: null };
  }
};
