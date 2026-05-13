"use server";

import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

/**
 * CREATE lead
 */
export const createLead = async (payload: unknown) => {
  try {
    return await fetchWithRefresh("/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create lead";
    return { success: false, message, data: null };
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
  } catch {
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
    const data = await fetchWithRefresh(`/leads/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!data.success) {
      throw new Error(data.message || "Lead not found");
    }
    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lead not found";
    throw new Error(message);
  }
};

/**
 * UPDATE lead
 */
export const updateLead = async (id: string, payload: unknown) => {
  try {
    return await fetchWithRefresh(`/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update lead";
    return { success: false, message, data: null };
  }
};

/**
 * DELETE lead
 */
export const deleteLead = async (id: string) => {
  try {
    return await fetchWithRefresh(`/leads/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete lead";
    return { success: false, message, data: null };
  }
};
