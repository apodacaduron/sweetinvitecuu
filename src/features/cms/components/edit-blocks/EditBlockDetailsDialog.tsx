"use client";

import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogProps } from '@radix-ui/react-dialog';

import { Block } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';

const blockDetailsSchema = z.object({
  class: z.string().or(z.literal("")),
  tag: z.string().or(z.literal("")),
  original: z.boolean(),
  style: z.string().or(z.literal("")),
  animation: z.string().or(z.literal("")),
});

type BlockDetailsSchema = z.infer<typeof blockDetailsSchema>;

type Props = {
  onSuccess?: () => void;
  item: Block | null;
  dialogProps: DialogProps;
};

const aosAnimations = [
  "none", // empty for 'None'
  "fade",
  "fade-up",
  "fade-down",
  "fade-left",
  "fade-right",
  "fade-up-right",
  "fade-up-left",
  "fade-down-right",
  "fade-down-left",
  "flip-up",
  "flip-down",
  "flip-left",
  "flip-right",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-in-up",
  "zoom-in-down",
  "zoom-in-left",
  "zoom-in-right",
  "zoom-out",
  "zoom-out-up",
  "zoom-out-down",
  "zoom-out-left",
  "zoom-out-right",
];

export default function EditBlockDetailsDialog(props: Props) {
  const { updateBlock } = useEditableBlocks();

  const form = useForm<BlockDetailsSchema>({
    resolver: zodResolver(blockDetailsSchema),
    defaultValues: {
      class: props.item?.class ?? "",
      original: Boolean(props.item?.original),
      tag: props.item?.tag ?? "",
      animation: props.item?.animation ?? "",
      style: JSON.stringify(props.item?.style, null, 2) ?? "",
    },
  });

  async function onSubmit(data: BlockDetailsSchema) {
    if (!props.item) return;
    try {
      updateBlock({
        ...props.item,
        ...data,
        style: JSON.parse(data.style || "{}"),
      });

      props.onSuccess?.();
    } catch (error) {
      toast("Could not update block details");
      throw error;
    }
  }

  useEffect(() => {
    form.reset({
      class: props.item?.class ?? "",
      original: Boolean(props.item?.original),
      tag: props.item?.tag ?? "",
      animation: props.item?.animation ?? "",
      style: JSON.stringify(props.item?.style, null, 2) ?? "",
    });
  }, [props.item, form]);

  return (
    <Dialog {...props.dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update block details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Assign a class to this block"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Assign a tag to this block"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Assign CSS styles to this block"
                      {...field}
                      className="font-mono min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="animation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animation</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        {aosAnimations.map((anim) => (
                          <SelectItem key={anim || "none"} value={anim}>
                            {anim || "None"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="original"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Mark as original block</FormLabel>
                    <FormDescription>
                      Protected blocks can’t be deleted from the template, but
                      you can hide them if needed.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
