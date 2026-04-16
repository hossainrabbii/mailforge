"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

// random delay 1-5 mins in ms
const randomDelay = () => (Math.floor(Math.random() * 5) + 1) * 60 * 1000;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface QueueState {
  running: boolean;
  currentIndex: number;
  total: number;
  countdownMs: number | null;
}

export const useMailQueue = () => {
  const [state, setState] = useState<QueueState>({
    running: false,
    currentIndex: 0,
    total: 0,
    countdownMs: null,
  });

  const stopRef = useRef(false);

  // NEW: warn user if they try to close tab while queue is running
  useEffect(() => {
    if (!state.running) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Mail queue is running. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state.running]);

  const sendSingle = async (id: string, templateId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    const res = await fetch(`${BASE_URL}/mail/send-single`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ id, templateId }),
    });

    return res.json();
  };

  const startQueue = async (selectedIds: string[], templateId: string) => {
    stopRef.current = false;

    setState({
      running: true,
      currentIndex: 0,
      total: selectedIds.length,
      countdownMs: null,
    });

    for (let i = 0; i < selectedIds.length; i++) {
      if (stopRef.current) {
        toast.info("Mail queue stopped");
        break;
      }

      setState((prev) => ({ ...prev, currentIndex: i + 1, countdownMs: null }));

      // send single mail — each request is ~2s, Vercel safe
      const res = await sendSingle(selectedIds[i], templateId);

      if (!res?.success) {
        toast.error(res?.message || "Failed to send mail");
      }

      // if not last — wait random delay in browser
      if (i < selectedIds.length - 1 && !stopRef.current) {
        const delayMs = randomDelay();
        const delayMins = Math.round(delayMs / 60000);

        toast.info(`Next mail in ~${delayMins} minute(s)`);

        // countdown tick every second
        const start = Date.now();
        while (Date.now() - start < delayMs) {
          if (stopRef.current) break;
          const remaining = delayMs - (Date.now() - start);
          setState((prev) => ({ ...prev, countdownMs: remaining }));
          await delay(1000);
        }

        setState((prev) => ({ ...prev, countdownMs: null }));
      }
    }

    setState({
      running: false,
      currentIndex: 0,
      total: 0,
      countdownMs: null,
    });

    if (!stopRef.current) {
      toast.success("All mails processed!");
    }
  };

  const stopQueue = () => {
    stopRef.current = true;
    setState((prev) => ({ ...prev, running: false, countdownMs: null }));
  };

  return { state, startQueue, stopQueue };
};
