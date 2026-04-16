"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/StatusBadge";
import type { Website, Template } from "@/types";
import { toast } from "sonner";
import { CountdownCircle } from "@/components/CountdownCircle";
import { useMailQueue } from "@/hooks/useMailQueue";

interface IProps {
  template: Template[];
  website: Website[];
  error: string | null;
}

type MailStatus = "all" | "pending" | "sent" | "failed";

export default function SendMailPage({ template, website, error }: IProps) {
  const [websites] = useState<Website[]>(website);
  const [templates] = useState<Template[]>(template.filter((t) => t.active));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MailStatus>("pending");

  // NEW: use queue hook
  const { state, startQueue, stopQueue } = useMailQueue();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = websites.filter((w) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      !search ||
      w.name?.toLowerCase().includes(searchText) ||
      w.currentUrl?.toLowerCase().includes(searchText);
    const matchesStatus =
      statusFilter === "all" || w.mailStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedTemplate = templates.find((t) => t._id === selectedTemplateId);
  const firstSelected = websites.find((w) => selectedIds.has(w._id));

  const previewHtml = useMemo(() => {
    if (!selectedTemplate || !firstSelected) return "";
    const name = firstSelected.name || "Client";
    const currentUrl = firstSelected.currentUrl || "";
    const remakeUrl = firstSelected.remakeUrl || "";
    return selectedTemplate.bodyHtml
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{currentUrl\}\}/g, currentUrl)
      .replace(
        /\{\{remakeSection\}\}/g,
        remakeUrl
          ? `<p>Check out your redesigned site: <a href="${remakeUrl}">${remakeUrl}</a></p>`
          : "",
      );
  }, [selectedTemplate, firstSelected]);

  const previewSubject = useMemo(() => {
    if (!selectedTemplate || !firstSelected) return "";
    const name = firstSelected.name || "Client";
    const currentUrl = firstSelected.currentUrl || "";
    return selectedTemplate.subject
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{currentUrl\}\}/g, currentUrl);
  }, [selectedTemplate, firstSelected]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  // NEW: start queue instead of old sendMail
  const handleSend = async () => {
    await startQueue(Array.from(selectedIds), selectedTemplateId);
  };

  const canSend =
    selectedIds.size > 0 && !!selectedTemplateId && !state.running;

  return (
    <div className="space-y-4">
      {/* NEW: queue progress bar */}
      {state.running && (
        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-sm font-medium">
              Sending {state.currentIndex} of {state.total}...
            </p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={stopQueue}
            className="gap-1.5"
          >
            <Square className="w-3 h-3" />
            Stop
          </Button>
        </div>
      )}

      {/* countdown circle */}
      {state.countdownMs && (
        <div className="flex justify-center py-2">
          <CountdownCircle delayMs={state.countdownMs} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 h-full">
        {/* Left: Recipients */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Recipients</CardTitle>
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search websites..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as MailStatus)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto space-y-1">
            {filtered.map((w) => (
              <label
                key={w._id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedIds.has(w._id)}
                  onCheckedChange={() => toggleSelect(w._id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {w.name || w.currentUrl}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {w.mailId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <small>
                    <strong>{w.majorIssues || ""}</strong>
                  </small>
                  <StatusBadge status={w.mailStatus} />
                </div>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No websites found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Right: Template & Preview */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Template</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedTemplateId}
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t._id} value={t._id as string}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedTemplate && firstSelected && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Preview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing preview for:{" "}
                  {firstSelected.name || firstSelected.currentUrl}
                </p>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-secondary/20">
                  <p className="text-sm font-medium mb-2">
                    Subject: {previewSubject}
                  </p>
                  <div className="border-t pt-3">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedIds.size} recipient(s) selected
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!canSend}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Emails
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Send {selectedIds.size} emails?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send emails using &quot;{selectedTemplate?.name}
                    &quot; to {selectedIds.size} selected websites with random
                    delays between each send.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSend}>
                    Send
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
