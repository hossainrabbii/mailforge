"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  ExternalLink,
  Key,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { getMailConfig, saveMailConfig } from "@/services/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;



const steps = [
  {
    number: "01",
    title: "Open Google Account",
    description: "Go to myaccount.google.com and sign in",
  },
  {
    number: "02",
    title: "Security settings",
    description: 'Navigate to Security → 2-Step Verification (must be enabled)',
  },
  {
    number: "03",
    title: "App Passwords",
    description: 'Scroll down and click "App passwords"',
  },
  {
    number: "04",
    title: "Generate password",
    description: 'Select "Mail" and your device, then click Generate',
  },
];

export function MailConfigSetup() {
  const router = useRouter();
  const [appPassword, setAppPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [config, setConfig] = useState<{
    email: string;
    appPassword: boolean;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await getMailConfig();
      if (res.success) setConfig(res.data);
      setFetching(false);
    };
    load();
  }, []);
console.log(config)
  const handleSave = async () => {
    if (!appPassword.trim()) {
      toast.error("Please enter your app password");
      return;
    }

    setLoading(true);
    try {
      const res = await saveMailConfig(appPassword.trim());
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("App password verified and saved!");
      setConfig((prev) =>
        prev ? { ...prev, appPassword: true } : null,
      );
      setAppPassword("");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Email Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Connect your Gmail to start sending outreach emails
        </p>
      </div>

      {/* Status card */}
      <div
        className="rounded-2xl border p-5 flex items-center gap-4"
        style={{
          background: config?.appPassword
            ? "rgba(34,197,94,0.05)"
            : "rgba(249,115,22,0.05)",
          borderColor: config?.appPassword
            ? "rgba(34,197,94,0.2)"
            : "rgba(249,115,22,0.2)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: config?.appPassword
              ? "rgba(34,197,94,0.1)"
              : "rgba(249,115,22,0.1)",
          }}
        >
          {config?.appPassword ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Shield className="w-5 h-5 text-orange-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {config?.appPassword
              ? "Gmail connected"
              : "Gmail not connected"}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {config?.email || "No email found"}
          </p>
        </div>
        {config?.appPassword && (
          <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
            Active
          </span>
        )}
      </div>

      {/* App password input */}
      <div className="rounded-2xl border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Key className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {config?.appPassword ? "Update app password" : "Set app password"}
            </p>
            <p className="text-xs text-muted-foreground">
              This will be verified against your Gmail account
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Gmail App Password
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="xxxx xxxx xxxx xxxx"
              className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            16-character password generated by Google — not your Gmail password
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !appPassword.trim()}
          className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading || !appPassword.trim()
              ? "#f9731666"
              : "#f97316",
            boxShadow: loading || !appPassword.trim()
              ? "none"
              : "0 4px 16px rgba(249,115,22,0.3)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying with Gmail...
            </>
          ) : (
            <>
              {config?.appPassword ? "Update" : "Verify & Save"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* How to get app password */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            How to get an app password
          </p>
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 transition-colors"
          >
            Open Google
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">
                  {step.number}
                </span>
              </div>
              <div className="pt-1">
                <p className="text-sm font-medium text-foreground leading-none mb-1">
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skip for now */}
      {!config?.appPassword && (
        <p className="text-center text-xs text-muted-foreground">
          You can set this later in settings.{" "}
          <button
            onClick={() => router.push("/dashboard")}
            className="text-orange-500 hover:underline"
          >
            Go to dashboard
          </button>
        </p>
      )}
    </div>
    
  );
}