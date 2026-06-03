import { z } from "zod";

export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}_\-+=~`|\\:;"'<>,./]).{8,}$/;

export const PASSWORD_VALIDATION_MESSAGE =
  "Password does not meet all requirements";

export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter (A–Z)",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lowercase letter (a–z)",
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    id: "digit",
    label: "One number (0–9)",
    test: (p: string) => /\d/.test(p),
  },
  {
    id: "special",
    label: "One special character (!@#$…)",
    test: (p: string) => /[@$!%*?&#^()[\]{}_\-+=~`|\\:;"'<>,./]/.test(p),
  },
] as const;

export const isPasswordStrong = (password: string): boolean =>
  PASSWORD_RULES.every((rule) => rule.test(password));

export const strongPasswordSchema = z
  .string()
  .regex(STRONG_PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE);
