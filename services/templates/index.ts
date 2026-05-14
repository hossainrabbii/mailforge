"use server";

import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

export const createTemplate = async (payload: unknown) => {
  try {
    return await fetchWithRefresh("/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create template";
    return { success: false, message, data: null };
  }
};

export const getAllTemplates = async () => {
  try {
    const data = await fetchWithRefresh("/templates", {
      method: "GET",
      cache: "no-store",
    });

    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch templates.",
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

export const getTemplateById = async (id: string) => {
  try {
    return await fetchWithRefresh(`/templates/${id}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Template not found";
    return { success: false, message, data: null };
  }
};

export const updateTemplate = async (id: string, payload: unknown) => {
  try {
    return await fetchWithRefresh(`/templates/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update template";
    return { success: false, message, data: null };
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    return await fetchWithRefresh(`/templates/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete template";
    return { success: false, message, data: null };
  }
};
