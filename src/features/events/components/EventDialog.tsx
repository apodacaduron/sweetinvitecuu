"use client";

import { format } from 'date-fns';
import { Check, ChevronDownIcon, ChevronsUpDown, Loader2Icon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFileUploader } from '@/hooks/useFileUploader';
import { slugify } from '@/lib/helpers';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogProps } from '@radix-ui/react-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Event } from './EventsTable';

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string(),
  event_date: z.date({ error: "Event date is required" }),
  template_id: z.uuidv4(),
  client_id: z.uuidv4(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.url().optional(),
  bgMusicUrl: z.url().optional(),
  themeColor: z.string().optional(),
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
      client_id: props.item?.client_id ?? "",
      seoTitle: props.item?.seo_title ?? "",
      seoDescription: props.item?.seo_description ?? "",
      seoImage: props.item?.og_image_url ?? "",
      bgMusicUrl: props.item?.music_url ?? "",
      themeColor: props.item?.theme_color ?? "#000000",
    },
  });
  const nameValue = form.watch("title"); // 🔁 Reactively watch "name"

  const [eventOpen, setEventOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [clientOpen, setClientOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  const templatesQuery = useQuery({
    queryKey: ["template-search", templateSearch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("id, name, search")
        .ilike("search", `%${templateSearch}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: templateOpen || !!templateSearch,
  });

  const clientsQuery = useQuery({
    queryKey: ["client-search", clientSearch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, search")
        .ilike("search", `%${clientSearch}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: clientOpen || !!clientSearch,
  });

  const selectedTemplate = useMemo(
    () => templatesQuery.data?.find((t) => t.id === form.getValues("template_id")),
    [templatesQuery.data, form.watch("template_id")]
  );

  const selectedClient = useMemo(
    () => clientsQuery.data?.find((c) => c.id === form.getValues("client_id")),
    [clientsQuery.data, form.watch("client_id")]
  );

  // File uploaders for SEO Image and Background Music
  const seoImageUploader = useFileUploader({
    origin: "events",
    foldername: props.item?.id ?? "",
    filename: `seo-image`,
    bucket: "media",
    onUpdate: ({ publicUrl }) => {
      form.setValue("seoImage", publicUrl);
      toast.success("SEO image uploaded!");
    },
    eventId: props.item?.id || null
  });

  const bgMusicUploader = useFileUploader({
    origin: "events",
    foldername: props.item?.id ?? "",
    filename: `background-music`,
    bucket: "media",
    onUpdate: ({ publicUrl }) => {
      form.setValue("bgMusicUrl", publicUrl);
      toast.success("Background music uploaded!");
    },
    eventId: props.item?.id || null
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Event, 'blocks' | 'id' | 'created_at' | 'created_by' | 'search'>) => {
      return supabase.from("events").insert(data).throwOnError();
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
    mutationFn: async (data: Partial<Event>) => {
      if (!props.item?.id)
        throw new Error("Could not update event, id was not provided");

      return supabase
        .from("events")
        .update(data)
        .eq("id", props.item.id)
        .throwOnError();
    },
    async onSuccess() {
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

    // Map form fields to DB column names
    const payload = {
      ...data,
      event_date: data.event_date.toISOString(),
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
      title: props.item?.title ?? "",
      slug: props.item?.slug ?? "",
      event_date: props.item?.event_date
        ? new Date(props.item.event_date)
        : new Date(),
      template_id: props.item?.template_id ?? "",
      client_id: props.item?.client_id ?? "",
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
            {props.item?.id ? "Update event" : "Add new event"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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

            {/* Event Date + Time Picker */}
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => {
                const date = field.value ? new Date(field.value) : undefined;
                const hours = date?.getHours().toString().padStart(2, "0") ?? "00";
                const minutes = date?.getMinutes().toString().padStart(2, "0") ?? "00";

                return (
                  <FormItem>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-1">
                        <FormLabel className="px-1 h-5">Event Date</FormLabel>
                        <Popover open={eventOpen} onOpenChange={setEventOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="justify-between font-normal">
                                {date ? format(date, "PPP") : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              onSelect={(selectedDate) => {
                                if (!selectedDate) return;
                                const updated = new Date(selectedDate);
                                if (date) updated.setHours(date.getHours(), date.getMinutes());
                                field.onChange(updated);
                                setEventOpen(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

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
                            const [h, m] = e.target.value.split(":").map(Number);
                            const updated = new Date(field.value || new Date());
                            updated.setHours(h ?? 0, m);
                            field.onChange(updated);
                          }}
                          className="w-28 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Template Selector */}
            <FormField
              control={form.control}
              name="template_id"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel>Template</FormLabel>
                  <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className="justify-between w-full">
                          {selectedTemplate?.name ?? "Select a template"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search template..."
                          className="h-9"
                          value={templateSearch}
                          onValueChange={setTemplateSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No template found.</CommandEmpty>
                          <CommandGroup>
                            {templatesQuery.data?.map((template) => (
                              <CommandItem
                                key={template.id}
                                value={template.name}
                                onSelect={() => {
                                  form.setValue("template_id", template.id);
                                  setTemplateOpen(false);
                                }}
                              >
                                {template.name}
                                <Check className={cn("ml-auto h-4 w-4", template.id === form.watch("template_id") ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Selector */}
            <FormField
              control={form.control}
              name="client_id"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel>Client</FormLabel>
                  <Popover open={clientOpen} onOpenChange={setClientOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className="justify-between w-full">
                          {selectedClient?.name ?? "Select a client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search client..."
                          className="h-9"
                          value={clientSearch}
                          onValueChange={setClientSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No client found.</CommandEmpty>
                          <CommandGroup>
                            {clientsQuery.data?.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={client.name ?? ''}
                                onSelect={() => {
                                  form.setValue("client_id", client.id);
                                  setClientOpen(false);
                                }}
                              >
                                {client.name}
                                <Check className={cn("ml-auto h-4 w-4", client.id === form.watch("client_id") ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Misc Fields */}
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
                {form.watch("seoImage") && <span className="ml-2 text-xs text-green-600">(Image already selected)</span>}
              </FormLabel>
              <Input type="file" accept="image/*" onChange={seoImageUploader.handleFileChange} />
            </FormItem>

            <FormItem>
              <FormLabel>
                Background Music
                {form.watch("bgMusicUrl") && <span className="ml-2 text-xs text-green-600">(Song already selected)</span>}
              </FormLabel>
              <Input type="file" accept="audio/*" onChange={bgMusicUploader.handleFileChange} />
            </FormItem>

            <Button type="submit" className="w-full mt-4" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}