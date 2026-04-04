"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface SSEOptions {
  onCountdown?: (delayMs: number) => void;
  onDone?: () => void;
}

type SSEEvent = MessageEvent<string>;

export const useMailSSE = ({ onCountdown, onDone }: SSEOptions = {}) => {
  useEffect(() => {
    const es = new EventSource("http://localhost:5000/api/v1/mail/events");

    es.addEventListener("mail_sent", (e) => {
      const data = JSON.parse((e as SSEEvent).data);
      toast.success(data.message);
    });

    es.addEventListener("mail_failed", (e) => {
      const data = JSON.parse((e as SSEEvent).data);
      toast.error(data.message);
    });

    es.addEventListener("countdown", (e) => {
      const data = JSON.parse((e as SSEEvent).data);
      toast.info(data.message);
      onCountdown?.(data.delayMs);
    });

    es.addEventListener("done", (e) => {
      const data = JSON.parse((e as SSEEvent).data);
      toast.success(data.message);
      onDone?.();
    });

    es.onerror = () => {
      toast.error("Connection lost. Retrying...");
    };

    return () => es.close();
  }, []);
};
