import { HeroPanel } from "@/components/HeroPanel";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[oklch(0.96_0.02_160)] via-background to-[oklch(0.96_0.02_180)]">
      <HeroPanel />
      <ForgotPasswordForm />
    </div>
  );
}
