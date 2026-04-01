"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// import { useToast } from "@/hooks/use-toast";
import type { Website } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { mockWebsites } from "@/lib/mock-data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  createWebsite,
  deleteWebsite,
  updateWebsite,
} from "@/services/websites";
import { toast } from "sonner";
import Link from "next/link";

/* ---------------- Schema ---------------- */

const websiteSchema = z.object({
  name: z.string().trim().max(100).optional(),
  currentUrl: z.string().trim().url("Must be a valid URL"),
  remakeUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  mailId: z.string().trim().email("Must be a valid email"),
  associateMail: z.string().trim().email("Must be a valid email"),
  phone: z.string().trim().max(20).optional(),
  country: z.string().trim().max(50).optional(),
  city: z.string().trim().max(50).optional(),
});

interface IProps {
  website: Website[];
}

type WebsiteFormValues = z.infer<typeof websiteSchema>;

export default function WebsitesPage({ website }: IProps) {
  const [websites, setWebsites] = useState<Website[]>(website);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // console.log(website);

  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteSchema),
    defaultValues: {
      name: "",
      currentUrl: "",
      remakeUrl: "",
      mailId: "",
      associateMail: "",
      phone: "",
      country: "",
      city: "",
    },
  });

  /* ---------------- Filters ---------------- */
  // console.log(website.filter(d))
  const filtered = websites.filter((w) => {
    const matchesSearch =
      !search ||
      w.name?.toLowerCase().includes(search.toLowerCase()) ||
      w.currentUrl.toLowerCase().includes(search.toLowerCase()) ||
      w.mailId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || w.mailStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ---------------- Handlers ---------------- */

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((w) => w._id)));
  };
  const onSubmit = async (data: WebsiteFormValues) => {
    if (editingId) {
      // fix: was "values" → should be "data"
      const response = await updateWebsite(editingId, data);
      if (!response?.success) {
        toast("Something went wrong");
        return;
      }
      // update local state after success
      setWebsites((prev) =>
        prev.map((w) =>
          w._id === editingId
            ? { ...w, ...data, remakeUrl: data.remakeUrl || undefined }
            : w,
        ),
      );
      toast("Website Updated");
    } else {
      const newSite: Website = {
        _id: crypto.randomUUID(),
        ...data,
        remakeUrl: data.remakeUrl || undefined,
        mailStatus: "pending",
      };

      const response = await createWebsite(data);
      if (!response?.success) {
        toast("Something went wrong");
        return;
      }
      toast("Website Added");
      setWebsites((prev) => [...prev, newSite]);
    }

    setDialogOpen(false);
    setEditingId(null);
    form.reset();
  };
  const handleEdit = (w: Website) => {
    setEditingId(w._id);
    form.reset({
      name: w.name || "",
      currentUrl: w.currentUrl,
      remakeUrl: w.remakeUrl || "",
      mailId: w.mailId,
      associateMail: w.associateMail,
      phone: w.phone || "",
      country: w.country || "",
      city: w.city || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteWebsite(id);
    if (!res?.success) {
      toast(res?.message);
      return;
    }
    toast.warning(res?.message);
    setWebsites((prev) => prev.filter((w) => w._id !== id));
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search websites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Website
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Website" : "Add Website"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "name",
                    "currentUrl",
                    "remakeUrl",
                    "mailId",
                    "associateMail",
                    "phone",
                    "country",
                    "city",
                  ].map((field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{field.name}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingId ? "Update" : "Add"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    filtered.length > 0 && selected.size === filtered.length
                  }
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Current URL</TableHead>
              <TableHead>Remake URL</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((w) => (
              <TableRow key={w._id}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(w._id)}
                    onCheckedChange={() => toggleSelect(w._id)}
                  />
                </TableCell>
                <TableCell>{w.name || "—"}</TableCell>
                <TableCell className="truncate max-w-[200px]">
                  <Link href={w.currentUrl}> {w.currentUrl}</Link>
                </TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {w.remakeUrl}
                </TableCell>
                <TableCell>{w.mailId}</TableCell>
                <TableCell>
                  <StatusBadge status={w.mailStatus} />
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(w)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(w._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
