const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

const saveAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
  document.cookie = `accessToken=${token}; path=/; max-age=${2 * 60 * 60}`;
};

const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
  document.cookie = "accessToken=; path=/; max-age=0";
};

export const register = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return res.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success && data.accessToken) {
      saveAccessToken(data.accessToken);
    }

    return data;
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const verifyOtp = async (userId: string, otp: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, otp }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success && data.accessToken) {
      saveAccessToken(data.accessToken);
    }

    return data;
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const resendOtp = async (userId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    clearAccessToken();
    return res.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};
