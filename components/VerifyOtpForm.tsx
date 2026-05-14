"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyOtp, resendOtp } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // get userId and email from URL params
  const userId = searchParams.get("userId") || "";
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60); // resend cooldown
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // redirect if no userId
  useEffect(() => {
    if (!userId) router.push("/");
  }, [userId]);

  const handleChange = (index: number, value: string) => {
    // only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);

    // auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // on backspace → clear and move to previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    // focus last filled input
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.warning("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(userId, otpString);

      if (!response?.success) {
        toast.error(response?.message || "Verification failed");
        // clear OTP on wrong code
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      toast.success("Email verified! Welcome to MailForge.");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResending(true);
    try {
      const response = await resendOtp(userId);
      if (!response?.success) {
        toast.error(response?.message || "Failed to resend OTP");
        return;
      }
      toast.success("New OTP sent to your email");
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-orange-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check your inbox or spam folder.
          </h1>
          <p className="text-muted-foreground text-sm">
            We sent a 6-digit code to
          </p>
          <p className="font-medium text-foreground text-sm mt-1">{email}</p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-3 justify-center mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`
                w-12 h-14 text-center text-xl font-bold rounded-xl border-2 
                bg-background text-foreground outline-none transition-all
                ${digit
                  ? "border-orange-500 bg-orange-500/5"
                  : "border-input hover:border-orange-500/50"
                }
                focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
              `}
            />
          ))}
        </div>

        {/* Verify button */}
        <Button
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6}
          className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold mb-4"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span>Verifying...</span>
              <Spinner />
            </div>
          ) : (
            "Verify Email"
          )}
        </Button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || resending}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
            {canResend
              ? resending ? "Sending..." : "Resend OTP"
              : `Resend in ${countdown}s`
            }
          </button>
        </div>

        {/* Back to login */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Wrong email?{" "}
          <button
            onClick={() => router.push("/")}
            className="text-orange-500 hover:underline"
          >
            Go back
          </button>
        </p>

      </div>
    </div>
  );
}