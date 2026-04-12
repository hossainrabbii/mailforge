"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { register as registerUser, login as loginUser } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type RegisterValues = z.infer<typeof registerSchema>;
type LoginValues = z.infer<typeof loginSchema>;
type TabType = "register" | "login";

export function SignupForm() {
  const [tab, setTab] = useState<TabType>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onRegister = async (data: RegisterValues) => {
    setLoading(true);

    try {
      const response = await registerUser(data.email, data.password);

      if (!response?.success) {
        toast.warning(response?.message || "Registration failed");
        return;
      }

      toast.success(response.message);

      setTimeout(() => {
        router.push("/dashboard");
      }, 100); // avoids race condition
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  const onLogin = async (data: LoginValues) => {
    setLoading(true);
    const response = await loginUser(data?.email, data?.password);
    if (!response?.success) {
      toast.warning(response?.message);
      return;
    }
    toast.success(response?.message);
    router.push("/dashboard");
    setLoading(false);
  };

  const activeForm = tab === "register" ? registerForm : loginForm;

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
          {tab === "register" ? "Create an account" : "Welcome back"}
        </h2>

        {/* Tab toggle */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-input p-1 gap-1">
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === "register"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                tab === "login"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </div>
        </div>

        {/* Register Form */}
        {tab === "register" && (
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegister)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
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

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="h-12 rounded-xl pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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
                  <>
                    <p>"Creating account..."</p>
                    <Spinner />
                  </>
                ) : (
                  "Create an Account"
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
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

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="h-12 rounded-xl pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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
                  <>
                    <p>"Logging in..."</p>
                    <Spinner />
                  </>
                ) : (
                  "Log In"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  className="font-semibold text-foreground hover:underline"
                >
                  Forgot password?
                </button>
              </p>
            </form>
          </Form>
        )}

        {/* Switch prompt */}
        <p className="text-center text-sm text-muted-foreground">
          {tab === "register" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("login")}
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
              >
                <LogIn className="w-3.5 h-3.5" /> Log In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("register")}
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
              >
                <UserPlus className="w-3.5 h-3.5" /> Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
