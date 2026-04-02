"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { RichTextEditor } from "@/components/RichTextEditor";
import type { Template } from "@/types";
import { mockTemplates } from "@/lib/mock-data";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import {
  createTemplate,
  deleteTemplate,
  updateTemplate,
} from "@/services/templates";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------
const templateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  bodyHtml: z.string().min(1, "Body is required"),
  active: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;
interface IProps {
  template: Template[];
  error: string | null;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function TemplatesPage({ template, error }: IProps) {
  const [templates, setTemplates] = useState<Template[]>(template);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  //   const { toast } = useToast();

   useEffect(() => {
      if (error) {
        toast.error(error);
      }
    }, [error]);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: { name: "", subject: "", bodyHtml: "", active: true },
  });

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      if (editingId) {
        // 🔹 Call update API
        const res = await updateTemplate(editingId, data);

        if (!res?.success) {
          toast("Failed to update template");
          return;
        }

        // 🔹 Update local state using updated template
        setTemplates((prev) =>
          prev.map((t) => (t._id === editingId ? { ...t, ...res.data } : t)),
        );

        toast("Template updated");
      } else {
        // 🔹 Create new template
        const newTemplate: Template = {
          name: data.name,
          subject: data.subject,
          bodyHtml: data.bodyHtml,
          active: data.active,
        };

        const res = await createTemplate(newTemplate);

        if (!res?.success) {
          toast("Failed to create new template");
          return;
        }

        setTemplates((prev) => [...prev, res.data]);
        toast("Template created");
      }

      closeDialog();
    } catch (error: any) {
      toast(error.message || "Something went wrong");
    }
  };

  const handleEdit = (t: Template) => {
    setEditingId(t._id as string);
    form.reset({
      name: t.name,
      subject: t.subject,
      bodyHtml: t.bodyHtml,
      active: t.active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTemplate(id);
    if (!res?.success) {
      toast(res?.message);
      return;
    }
    toast.warning(res?.message);
    setTemplates((prev) => prev.filter((t) => t._id !== id));
    // toast("Template deleted");
  };

  const toggleActive = async (id: string, active: boolean) => {
    // console.log(id, active);
    if (active) {
      const res = await updateTemplate(id, {
        active: false,
      });
    }
    if (!active) {
      const res = await updateTemplate(id, {
        active: true,
      });
    }

    setTemplates((prev) =>
      prev.map((t) => (t._id === id ? { ...t, active: !t.active } : t)),
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        {/* <p className="text-muted-foreground">{templates.length} templates</p> */}
        <p></p>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog();
            else setDialogOpen(true);
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Template
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Template" : "Create Template"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Website Redesign Pitch"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Line *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Transform Your Website – {{name}}"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Body (rich text) */}
                <Controller
                  control={form.control}
                  name="bodyHtml"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Body *</FormLabel>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Active toggle */}
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Template grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t._id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{t.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={t.active}
                    onCheckedChange={() =>
                      toggleActive(t._id as string, t.active)
                    }
                  />
                  <Badge
                    variant={t.active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {t.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 truncate">
                Subject: {t.subject}
              </p>

              <div className="flex gap-1">
                {/* Edit */}
                <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete template?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete &quot;{t.name}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(t._id as string)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
