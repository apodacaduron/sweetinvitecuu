"use client";

import { ExternalLink, Loader2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import EditBlockRenderer from '@/features/cms/components/edit-blocks/EditBlockRenderer';
import { Block } from '@/features/cms/context/BlocksContext';
import { EditableBlocksProvider } from '@/features/cms/context/EditableBlocksContext';
import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Json } from '../../../../../database.types';

export default function Page() {
  const params = useParams();
  const eventId = params.slug?.toString();

  const queryClient = useQueryClient();
  const [editableBlocks, setEditableBlocks] = useState<Block[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const saveBlocksMutation = useMutation({
    mutationFn: async () => {
      if (!eventId)
        throw new Error("Could not update blocks, event id not provided");

      return supabase
        .from("events")
        .update({
          blocks: editableBlocks as unknown as Json,
        })
        .eq("id", eventId)
        .throwOnError();
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["event", { id: eventId }],
      });
      toast.success("Event blocks updated");
    },
    onError(error) {
      toast.error("Failed to update event blocks", {
        description: error.message,
      });
    },
  });
  // 2. Cargar datos con react-query
  const eventQuery = useQuery({
    queryKey: ["event", { id: eventId }],
    queryFn: async () => {
      if (!eventId) throw new Error("Could not load event, id not provided");

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  // 3. Cuando la data llegue, actualizar el estado local para editar
  useEffect(() => {
    if (eventQuery.data?.blocks) {
      setEditableBlocks(eventQuery.data.blocks as unknown as Block[]);
      setPreviewUrl(
        `${window.location.origin}/events/${eventQuery.data?.slug}`
      );
    }
  }, [eventQuery.data]);

  return (
    <EditableBlocksProvider
      editableBlocks={editableBlocks}
      setEditableBlocks={setEditableBlocks}
      parentData={eventQuery.data}
      origin="events"
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader
            breadcrumbs={[
              { label: "Events", href: "/manage/events" },
              {
                label: eventQuery.data?.title ?? "Event details",
              },
            ]}
            actions={
              <>
                <Button
                  className="hidden sm:flex"
                  onClick={() => saveBlocksMutation.mutate()}
                  disabled={saveBlocksMutation.isPending}
                >
                  {saveBlocksMutation.isPending && (
                    <Loader2Icon className="animate-spin" />
                  )}
                  Save & Publish
                </Button>
                <Button
                  className="hidden sm:flex"
                  disabled={saveBlocksMutation.isPending}
                  variant="outline"
                >
                  Page settings
                </Button>
                <Button size="icon" variant="outline" asChild>
                  <a target="_blank" href={previewUrl}>
                    <ExternalLink />
                  </a>
                </Button>
              </>
            }
          />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {eventQuery.isLoading && (
                  <p className="text-center text-gray-500">
                    Cargando plantilla...
                  </p>
                )}
                {eventQuery.isError && (
                  <p className="text-center text-red-600">
                    Error al cargar la plantilla.
                  </p>
                )}
                {!eventQuery.isLoading &&
                  !eventQuery.isError &&
                  editableBlocks.length > 0 && (
                    <EditBlockRenderer blocks={editableBlocks} />
                  )}
                {!eventQuery.isLoading &&
                  !eventQuery.isError &&
                  editableBlocks.length === 0 && (
                    <p className="text-center text-gray-500">No hay bloques.</p>
                  )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </EditableBlocksProvider>
  );
}
