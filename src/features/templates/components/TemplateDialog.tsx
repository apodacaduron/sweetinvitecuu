"use client";

import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFileUploader } from '@/hooks/useFileUploader';
import { slugify } from '@/lib/helpers';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogProps } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Template } from './TemplatesTable';

const templateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  seo_title: z.string().optional().or(z.literal("")),
  seo_description: z.string().optional().or(z.literal("")),
  og_image_url: z.url().optional().or(z.literal("")),
  music_url: z.url().optional().or(z.literal("")),
  theme_color: z.string().optional().or(z.literal("")),
});

type TemplateSchema = z.infer<typeof templateSchema>;

type Props = {
  onSuccess?: () => void;
  item: Template | null;
  dialogProps: DialogProps;
  queryKeyGetter(): unknown[];
};

export default function TemplateForm(props: Props) {
  const queryTemplate = useQueryClient();

  const form = useForm<TemplateSchema>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: props.item?.name ?? "",
      slug: props.item?.slug ?? "",
      seo_title: props.item?.seo_title ?? "",
      seo_description: props.item?.seo_description ?? "",
      og_image_url: props.item?.og_image_url ?? "",
      music_url: props.item?.music_url ?? "",
      theme_color: props.item?.theme_color ?? "#000000",
    },
  });
  const nameValue = form.watch("name");

  // File uploaders for SEO Image and Background Music
  const seoImageUploader = useFileUploader({
    origin: "templates",
    foldername: props.item?.id ?? "",
    filename: `seo-image`,
    bucket: "media",
    onUpdate: ({ publicUrl }) => {
      form.setValue("og_image_url", publicUrl);
      toast.success("SEO image uploaded!");
    },
    templateId: props.item?.id || null,
  });

  const bgMusicUploader = useFileUploader({
    origin: "templates",
    foldername: props.item?.id ?? "",
    filename: `background-music`,
    bucket: "media",
    onUpdate: ({ publicUrl }) => {
      form.setValue("music_url", publicUrl);
      toast.success("Background music uploaded!");
    },
    templateId: props.item?.id || null,
  });

  const createMutation = useMutation({
    mutationFn: async (
      data: Omit<Template, "blocks" | "id" | "created_at" | "search">
    ) => {
      return supabase.from("templates").insert(data).throwOnError();
    },
    async onSuccess(_, variables) {
      await queryTemplate.invalidateQueries({
        queryKey: props.queryKeyGetter(),
      });
      toast.success("Template added!", {
        description: variables.name,
      });
      form.reset();
      props.onSuccess?.();
    },
    onError(error) {
      toast.error("Failed to add template", {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Template>) => {
      if (!props.item?.id)
        throw new Error("Could not update template, id was not provided");

      return supabase
        .from("templates")
        .update(data)
        .eq("id", props.item.id)
        .throwOnError();
    },
    async onSuccess() {
      await queryTemplate.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template updated");
      form.reset();
      props.onSuccess?.();
    },
    onError(error) {
      toast.error("Failed to update template", {
        description: error.message,
      });
    },
  });

  async function onSubmit(data: TemplateSchema) {
    const isUpdating = Boolean(props.item?.id);

    // Map form fields to DB column names
    const payload: Omit<Template, "blocks" | "id" | "created_at" | "search"> = {
      name: data.name,
      slug: data.slug,
      seo_title: data.seo_title ?? null,
      seo_description: data.seo_description ?? null,
      og_image_url: data.og_image_url ?? null,
      music_url: data.music_url ?? null,
      theme_color: data.theme_color ?? null,
    };

    if (isUpdating) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
  }

  useEffect(() => {
    form.reset({
      name: props.item?.name ?? "",
      slug: props.item?.slug ?? "",
      seo_title: props.item?.seo_title ?? "",
      seo_description: props.item?.seo_description ?? "",
      og_image_url: props.item?.og_image_url ?? "",
      music_url: props.item?.music_url ?? "",
      theme_color: props.item?.theme_color ?? "#000000",
    });
  }, [props.item, form]);

  useEffect(() => {
    form.setValue("slug", slugify(nameValue));
  }, [nameValue, form]);

  return (
    <Dialog {...props.dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.item?.id ? "Update template" : "Add new template"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Template name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SEO fields */}
            <FormField
              control={form.control}
              name="seo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Share Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter share title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seo_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Share Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter share description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>
                Social Share Image
                {form.watch("og_image_url") && (
                  <span className="ml-2 text-xs text-green-600">
                    (Image already selected)
                  </span>
                )}
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={seoImageUploader.handleFileChange}
                className="mt-1"
              />
            </FormItem>

            <FormItem>
              <FormLabel>
                Background Music
                {form.watch("music_url") && (
                  <span className="ml-2 text-xs text-green-600">
                    (Song already selected)
                  </span>
                )}
              </FormLabel>
              <Input
                type="file"
                accept="audio/*"
                onChange={bgMusicUploader.handleFileChange}
                className="mt-1"
              />
            </FormItem>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2Icon className="animate-spin" />
              )}
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
