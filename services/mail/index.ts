"use server";

import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API}/mail`;

/**
 * CREATE Website
 */
interface SendMailPayload {
  selectedIds: string[];
  selectedTemplateId: string;
}
export const sendMail = async (payload: SendMailPayload) => {
  try {
    return await fetchWithRefresh("/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to outreach";
    throw new Error(message);
  }
};

/**
 * GET ALL Websites
 */
export const getAllMail = async () => {
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
export const getMailById = async (id: string) => {
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
export const updateMail = async (id: string, payload: any) => {
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
export const deleteMail = async (id: string) => {
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
