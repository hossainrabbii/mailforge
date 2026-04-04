"use server";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API}/templates`;

/**
 * CREATE Website
 */
export const createTemplate = async (payload: any) => {
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
      throw new Error("Failed to create template");
    }

    return await res.json();
  } catch (
    error: any
  ) {
    console.log(error);
    throw new Error(error.message);
  }
};

/**
 * GET ALL Websites
 */
export const getAllTemplates = async () => {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch templates");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * GET SINGLE Website
 */
export const getTemplateById = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Template not found");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * UPDATE Website
 */
export const updateTemplate = async (id: string, payload: any) => {
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
      throw new Error("Failed to update template");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * DELETE Website
 */
export const deleteTemplate = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to delete template");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
