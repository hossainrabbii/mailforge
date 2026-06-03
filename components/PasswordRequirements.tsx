"use client";

import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/password";
import { cn } from "@/lib/utils";

type PasswordRequirementsProps = {
  password: string;
  className?: string;
};

export function PasswordRequirements({
  password,
  className,
}: PasswordRequirementsProps) {
  if (!password) return null;

  return (
    <ul
      className={cn(
        "mt-2 space-y-1.5 rounded-lg border border-input bg-muted/30 px-3 py-2.5 text-xs",
        className,
      )}
      aria-label="Password requirements"
    >
      <p className="mb-1.5 font-medium text-muted-foreground">
        Your password must include:
      </p>
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-2 transition-colors",
              met ? "text-green-600 dark:text-green-500" : "text-muted-foreground",
            )}
          >
            {met ? (
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
