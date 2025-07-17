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

import { Event } from './EventsTable';

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

type EventSchema = z.infer<typeof eventSchema>;

type Props = {
  onSuccess?: () => void;
  item: Event | null;
  dialogProps: DialogProps;
  queryKeyGetter(): unknown[];
};

export default function EventForm(props: Props) {
  const queryEvent = useQueryClient();

  const form = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: props.item?.title ?? "",
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: EventSchema) => {
      return supabase.from("events").insert(data).throwOnError();
    },
    async onSuccess(_, variables) {
      await queryEvent.invalidateQueries({
        queryKey: props.queryKeyGetter(),
      });
      toast.success("Event added!", {
        description: variables.title,
      });
      form.reset();
      props.onSuccess?.();
    },
    onError(error) {
      toast.error("Failed to add event", {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: EventSchema) => {
      if (!props.item?.id)
        throw new Error("Could not update event, id was not provided");

      return supabase
        .from("events")
        .update(data)
        .eq("id", props.item.id)
        .throwOnError();
    },
    async onSuccess(_, variables) {
      await queryEvent.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated");
      form.reset();
      props.onSuccess?.();
    },
    onError(error) {
      toast.error("Failed to update event", {
        description: error.message,
      });
    },
  });

  async function onSubmit(data: EventSchema) {
    const isUpdating = Boolean(props.item?.id);

    if (isUpdating) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  useEffect(() => {
    form.reset({
      title: props.item?.title ?? "",
    });
  }, [props.item, form]);

  return (
    <Dialog {...props.dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.item?.id ? "Update event" : "Add new event"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
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
