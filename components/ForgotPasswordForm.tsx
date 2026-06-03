"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { requestPasswordReset } from "@/services/auth/client";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotValues) => {
    setLoading(true);
    try {
      const response = await requestPasswordReset(data.email);

      if (!response?.success) {
        if (response?.requiresVerification && response?.userId) {
          toast.warning(response.message || "Please verify your email first");
          router.push(
            `/verify-otp?userId=${response.userId}&email=${encodeURIComponent(data.email)}`,
          );
          return;
        }
        toast.error(response?.message || "Request failed");
        return;
      }

      toast.success(response.message || "Check your email for the reset code");
      router.push(
        `/reset-password?userId=${response.userId}&email=${encodeURIComponent(response.email)}`,
      );
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-orange-500" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Forgot password?
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your registered email and we&apos;ll send you a reset code.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      className="h-12 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground text-sm font-semibold shadow-md"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Sending...
                  <Spinner />
                </span>
              ) : (
                "Send reset code"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/?tab=login"
            className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
