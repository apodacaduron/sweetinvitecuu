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
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogProps } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Template } from './TemplatesTable';

const templateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
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
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: TemplateSchema) => {
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
    mutationFn: async (data: TemplateSchema) => {
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

    if (isUpdating) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  useEffect(() => {
    form.reset({
      name: props.item?.name ?? "",
    });
  }, [props.item, form]);

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
