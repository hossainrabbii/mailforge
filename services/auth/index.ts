const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

// helper to save accessToken in both places
const saveAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
  // FIXED: was 15 * 60 (15 mins) — now matches 2h token lifetime
  document.cookie = `accessToken=${token}; path=/; max-age=${2 * 60 * 60}`;
};
const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
  // clear cookie too
  document.cookie = "accessToken=; path=/; max-age=0";
};

export const register = async (email: string, password: string) => {
  console.log("Reg Frontend:", email);
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
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

export const login = async (email: string, password: string) => {
  console.log(email);
  console.log(BASE_URL);
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    console.log(res);

    const data = await res.json();
    console.log(data);

    if (data.success && data.accessToken) {
      saveAccessToken(data.accessToken);
    }

    return data;
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
    clearAccessToken(); // NEW
    return res.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};
