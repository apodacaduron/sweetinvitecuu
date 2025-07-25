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
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.url().optional(),
  bgMusicUrl: z.url().optional(),
  themeColor: z.string().optional(),
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
      seoTitle: props.item?.seo_title ?? "",
      seoDescription: props.item?.seo_description ?? "",
      seoImage: props.item?.og_image_url ?? "",
      bgMusicUrl: props.item?.music_url ?? "",
      themeColor: props.item?.theme_color ?? "#000000",
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
      form.setValue("seoImage", publicUrl);
      toast.success("SEO image uploaded!");
    },
    ...(origin === "events"
      ? { eventId: props.item?.id }
      : { templateId: props.item?.id }),
  });

  const bgMusicUploader = useFileUploader({
    origin: "templates",
    foldername: props.item?.id ?? "",
    filename: `background-music`,
    bucket: "media",
    onUpdate: ({ publicUrl }) => {
      form.setValue("bgMusicUrl", publicUrl);
      toast.success("Background music uploaded!");
    },
    ...(origin === "events"
      ? { eventId: props.item?.id }
      : { templateId: props.item?.id }),
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Template, 'blocks' | 'id' | 'created_at' | 'search'>) => {
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
    async onSuccess(_, variables) {
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
    const payload: Omit<Template, 'blocks' | 'id' | 'created_at' | 'search'> = {
      name: data.name,
      slug: data.slug,
      seo_title: data.seoTitle ?? null,
      seo_description: data.seoDescription ?? null,
      og_image_url: data.seoImage ?? null,
      music_url: data.bgMusicUrl ?? null,
      theme_color: data.themeColor ?? null,
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
      seoTitle: props.item?.seo_title ?? "",
      seoDescription: props.item?.seo_description ?? "",
      seoImage: props.item?.og_image_url ?? "",
      bgMusicUrl: props.item?.music_url ?? "",
      themeColor: props.item?.theme_color ?? "#000000",
    });
  }, [props.item, form]);

  useEffect(() => {
    form.setValue("slug", slugify(nameValue));
  }, [nameValue]);

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
              name="themeColor"
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
              name="seoTitle"
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
              name="seoDescription"
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
                {form.watch("seoImage") && (
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
                {form.watch("bgMusicUrl") && (
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
