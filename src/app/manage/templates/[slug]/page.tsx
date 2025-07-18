"use client";

import { Loader2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import EditBlockRenderer from '@/features/cms/components/edit-blocks/EditBlockRenderer';
import { EditableBlocksProvider } from '@/features/cms/context/EditableBlocksContext';
import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function Page() {
  const params = useParams();
  const templateId = params.slug?.toString();

  const queryClient = useQueryClient();
  const [editableBlocks, setEditableBlocks] = useState([]);

  const saveBlocksMutation = useMutation({
    mutationFn: async () => {
      if (!templateId)
        throw new Error("Could not update blocks, template id not provided");

      return supabase
        .from("templates")
        .update({
          blocks: editableBlocks,
        })
        .eq("id", templateId)
        .throwOnError();
    },
    async onSuccess(_) {
      await queryClient.invalidateQueries({
        queryKey: ["template", { id: templateId }],
      });
      toast.success("Template blocks updated");
    },
    onError(error) {
      toast.error("Failed to update template blocks", {
        description: error.message,
      });
    },
  });
  // 2. Cargar datos con react-query
  const templateQuery = useQuery({
    queryKey: ["template", { id: templateId }],
    queryFn: async () => {
      if (!templateId)
        throw new Error("Could not load template, id not provided");

      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!templateId,
  });

  // 3. Cuando la data llegue, actualizar el estado local para editar
  useEffect(() => {
    if (templateQuery.data?.blocks) {
      setEditableBlocks(templateQuery.data.blocks);
    }
  }, [templateQuery.data]);

  return (
    <EditableBlocksProvider
      editableBlocks={editableBlocks}
      setEditableBlocks={setEditableBlocks}
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
            title={`Template ${templateQuery.data?.name}`}
            actions={
              <Button
                size="sm"
                className="hidden sm:flex"
                onClick={() => saveBlocksMutation.mutate()}
                disabled={saveBlocksMutation.isPending}
              >
                {saveBlocksMutation.isPending && <Loader2Icon className="animate-spin" />}
                Save & Publish
              </Button>
            }
          />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {templateQuery.isLoading && (
                  <p className="text-center text-gray-500">
                    Cargando plantilla...
                  </p>
                )}
                {templateQuery.isError && (
                  <p className="text-center text-red-600">
                    Error al cargar la plantilla.
                  </p>
                )}
                {!templateQuery.isLoading &&
                  !templateQuery.isError &&
                  editableBlocks.length > 0 && (
                    <EditBlockRenderer blocks={editableBlocks} />
                  )}
                {!templateQuery.isLoading &&
                  !templateQuery.isError &&
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
