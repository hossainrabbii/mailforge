import { api } from "@/lib/api";

export const getAllLeads = async () => {
  try {
    return await api("/leads");
  } catch {
    return { success: false, message: "Network error", data: null };
  }
};

export const createLead = async (payload: any) => {
  try {
    return await api("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return { success: false, message: "Network error", data: null };
  }
};

export const updateLead = async (id: string, payload: any) => {
  try {
    return await api(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  } catch {
    return { success: false, message: "Network error", data: null };
  }
};

export const deleteLead = async (id: string) => {
  try {
    return await api(`/leads/${id}`, {
      method: "DELETE",
    });
  } catch {
    return { success: false, message: "Network error", data: null };
  }
};