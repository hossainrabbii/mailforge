"use server";

const BASE_URL = "http://localhost:5000/api/v1/websites";

/**
 * CREATE Website
 */
export const createWebsite = async (payload: any) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to create website");
    }

    return await res.json();
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

/**
 * GET ALL Websites
 */
export const getAllWebsites = async () => {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch websites");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * GET SINGLE Website
 */
export const getWebsiteById = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Website not found");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * UPDATE Website
 */
export const updateWebsite = async (id: string, payload: any) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to update website");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * DELETE Website
 */
export const deleteWebsite = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to delete website");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
