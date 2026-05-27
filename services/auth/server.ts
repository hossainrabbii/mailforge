"use server";

import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

export const saveMailConfig = async (appPassword: string) => {
  const res = await fetchWithRefresh("/auth/mail-config", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appPassword }),
  });
  return res;
};

export const getMailConfig = async () => {
  const res = await fetchWithRefresh("/auth/mail-config", {
    method: "GET",
    credentials: "include",
  });
  return res;
};
