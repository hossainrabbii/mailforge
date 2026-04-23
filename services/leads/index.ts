"use server";

import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API}/leads`;

/**
 * CREATE lead
 */
export const createLead = async (payload: any) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return data;
    }

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

/**
 * GET ALL leads
 */

export const getAllLeads = async () => {
  try {
    const data = await fetchWithRefresh("/leads", {
      method: "GET",
      credentials: "include",
    });

    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch leads.",
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: "Network error — is the server running?",
      data: null,
    };
  }
};

/**
 * GET SINGLE lead
 */
export const getLeadById = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("lead not found");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * UPDATE lead
 */
export const updateLead = async (id: string, payload: any) => {
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
      throw new Error("Failed to update lead");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * DELETE lead
 */
export const deleteLead = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to delete lead");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
