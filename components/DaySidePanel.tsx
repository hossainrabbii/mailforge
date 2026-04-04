"use client";

import { format } from "date-fns";
import { X, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Website } from "@/types"; 
import Link from "next/link";

interface DaySidePanelProps {
  date: Date;
  emails: Website[]; 
  onClose: () => void;
}

export function DaySidePanel({ date, emails, onClose }: DaySidePanelProps) {
  return (
    <div className="w-[320px] shrink-0 animate-in slide-in-from-right-4 duration-200">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {format(date, "EEEE")}
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              {format(date, "MMMM d, yyyy")}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted p-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {emails.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {emails.length === 1 ? "Email sent" : "Emails sent"}
            </p>
          </div>
        </div>

        {/* Email list */}
        {emails.length > 0 ? (
          <div className="space-y-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Activity
            </p>
            {emails.map((email, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  {/* EDITED: show website name instead of generic "Email sent" */}
                  <p className="text-sm font-medium text-foreground">
                    {email.name || email.currentUrl}
                  </p>

                  <p className="text-xs text-gray-400 mb-2">
                    {/* <Link href={email?.currentUrl}>{email.currentUrl}</Link> */}
                    {email.currentUrl ? (
                      <Link href={email.currentUrl as string}>
                        {" "}
                        {email.currentUrl}
                      </Link>
                    ) : (
                      <>—</>
                    )}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {/* EDITED: guard for undefined sentAt */}
                    {email.sentAt
                      ? format(new Date(email.sentAt), "h:mm a")
                      : "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No emails</p>
            <p className="text-xs text-muted-foreground">
              No emails were sent on this day
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
