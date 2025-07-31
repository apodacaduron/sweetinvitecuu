import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import {
    BlockBase, resolveClassNames, RsvpProperties, useBlocks
} from '../../context/BlocksContext';

const rsvpSchema = z.object({
  name: z.string().min(1, { message: "Nombre es requerido" }),
  will_attend: z.enum(['yes', 'no']),
  people_count: z.string().regex(/^\d+$/, { message: "Debe ser un número" }),
  message: z.string(),
});

type RsvpSchema = z.infer<typeof rsvpSchema>;

export default function RsvpBlock(props: BlockBase<RsvpProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  const { parentData, origin } = useBlocks()

  const form = useForm<RsvpSchema>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      will_attend: "yes",
      people_count: "",
      message: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RsvpSchema) => {
      if (!parentData?.id) throw new Error('Could not send form, event id is required')

      const newRsvp = {
        ...data,
        people_count: Number(data.people_count) || 0,
        will_attend: data.will_attend === 'yes',
        event_id: parentData?.id
      }

      return supabase.from("rsvps").insert(newRsvp).throwOnError();
    },
    async onSuccess() {
      toast.success("Gracias por confirmar tu asistencia!");
      form.reset();
    },
    onError(error) {
      toast.error("Hubo un problema al enviar el formulario", {
        description: error.message,
      });
    },
  });

  async function onSubmit(data: RsvpSchema) {
    if (origin === 'templates') return

    await createMutation.mutateAsync(data);
  }

  return (
    <div id={props.id} data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style} data-type={props.type}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="will_attend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Podrás Asistir?</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Si, asistiré</SelectItem>
                      <SelectItem value="no">No, lo siento</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="people_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de personas que asistirán</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="No exceder el número de invitados" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensaje</FormLabel>
                <FormControl>
                  <Textarea placeholder="Escribe un mensaje o buenos deseos" {...field} />
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
    </div>
  );
}
