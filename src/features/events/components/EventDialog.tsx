"use client";

import { format } from 'date-fns';
import { ChevronDownIcon, Loader2Icon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { slugify } from '@/lib/helpers';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogProps } from '@radix-ui/react-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Event } from './EventsTable';

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string(),
  event_date: z.date({ error: "Event date is required" }),
  template_id: z.uuidv4(),
});

type EventSchema = z.infer<typeof eventSchema>;

type Props = {
  onSuccess?: () => void;
  item: Event | null;
  dialogProps: DialogProps;
  queryKeyGetter(): unknown[];
};

export default function EventForm(props: Props) {
  const queryClient = useQueryClient();

  const form = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: props.item?.title ?? "",
      slug: props.item?.slug ?? "",
      event_date: props.item?.event_date
        ? new Date(props.item.event_date)
        : new Date(),
      template_id: props.item?.template_id ?? "",
    },
  });
  const nameValue = form.watch("title"); // 🔁 Reactively watch "name"

  const templatesQuery = useQuery({
    queryKey: ["select-template"],
    queryFn: async () => {
      const query = supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false });

      const { data } = await query;
      return data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventSchema) => {
      const payload = {
        ...data,
        event_date: data.event_date.toISOString(),
      };

      return supabase.from("events").insert(payload).throwOnError();
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({
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

      const payload = {
        ...data,
        event_date: data.event_date.toISOString(),
      };

      return supabase
        .from("events")
        .update(payload)
        .eq("id", props.item.id)
        .throwOnError();
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
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
      slug: props.item?.slug ?? "",
      event_date: props.item?.event_date
        ? new Date(props.item.event_date)
        : new Date(),
      template_id: props.item?.template_id ?? "",
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
              name="event_date"
              render={({ field }) => {
                const date = field.value ? new Date(field.value) : undefined;
                const [open, setOpen] = React.useState(false);

                const hours =
                  date?.getHours().toString().padStart(2, "0") ?? "00";
                const minutes =
                  date?.getMinutes().toString().padStart(2, "0") ?? "00";

                return (
                  <FormItem>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-1">
                        <FormLabel className="px-1 h-5">Event Date</FormLabel>
                        {/* DATE PICKER */}
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="justify-between font-normal"
                              >
                                {date ? format(date, "PPP") : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              onSelect={(selectedDate) => {
                                if (!selectedDate) return;
                                const updated = new Date(selectedDate);
                                if (date) {
                                  updated.setHours(
                                    date.getHours(),
                                    date.getMinutes()
                                  );
                                }
                                field.onChange(updated);
                                setOpen(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* TIME PICKER */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="time-picker" className="px-1 text-sm">
                          Time
                        </Label>
                        <Input
                          id="time-picker"
                          type="time"
                          step="60"
                          value={`${hours}:${minutes}`}
                          onChange={(e) => {
                            const [h, m] = e.target.value
                              .split(":")
                              .map(Number);
                            const updated = new Date(field.value || new Date());
                            updated.setHours(h, m);
                            field.onChange(updated);
                          }}
                          className="bg-background w-28 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="template_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={templatesQuery.isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templatesQuery.data?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
