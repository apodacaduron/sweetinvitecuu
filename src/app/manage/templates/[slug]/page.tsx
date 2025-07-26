"use client";

import { Code, Cog, ExternalLink, Layout, Loader2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AddBlockButton from '@/features/cms/components/edit-blocks/AddBlockButton';
import EditBlockRenderer from '@/features/cms/components/edit-blocks/EditBlockRenderer';
import { Block } from '@/features/cms/context/BlocksContext';
import { EditableBlocksProvider } from '@/features/cms/context/EditableBlocksContext';
import { JsonEditor } from '@/features/templates/components/JsonEditor';
import { supabase } from '@/lib/supabase';
import { IconDotsVertical } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Json } from '../../../../../database.types';

export default function Page() {
  const params = useParams();
  const templateId = params.slug?.toString();

  const queryClient = useQueryClient();
  const [editorType, setEditorType] = useState<"ui" | "json">("ui");
  const [editableBlocks, setEditableBlocks] = useState<Block[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const saveBlocksMutation = useMutation({
    mutationFn: async () => {
      if (!templateId)
        throw new Error("Could not update blocks, template id not provided");

      return supabase
        .from("templates")
        .update({
          blocks: editableBlocks as unknown as Json,
        })
        .eq("id", templateId)
        .throwOnError();
    },
    async onSuccess() {
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
      setEditableBlocks(templateQuery.data.blocks as unknown as Block[]);
      setPreviewUrl(
        `${window.location.origin}/templates/${templateQuery.data?.slug}`
      );
    }
  }, [templateQuery.data]);

  return (
    <EditableBlocksProvider
      editableBlocks={editableBlocks}
      setEditableBlocks={setEditableBlocks}
      parentData={templateQuery.data}
      origin="templates"
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
              { label: "Templates", href: "/manage/templates" },
              {
                label: templateQuery.data?.name ?? "Template details",
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                      size="icon"
                    >
                      <IconDotsVertical />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        setEditorType((prevType) =>
                          prevType === "ui" ? "json" : "ui"
                        )
                      }
                    >
                      {editorType === "ui" ? <Code /> : <Layout />}
                      {editorType === "ui" ? "JSON View" : "UI View"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Cog /> Page settings
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a target="_blank" href={previewUrl}>
                        <ExternalLink />
                        Preview
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
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
                {!templateQuery.isLoading && !templateQuery.isError && (
                  <>
                    {editorType === "ui" ? (
                      editableBlocks.length > 0 ? (
                        <EditBlockRenderer blocks={editableBlocks} />
                      ) : (
                        <div className="text-center text-gray-500 py-10">
                          <p className="mb-4">No hay bloques.</p>
                          <AddBlockButton mode="adjacent" />
                        </div>
                      )
                    ) : (
                      <JsonEditor
                        value={editableBlocks}
                        onChange={(newJson) => setEditableBlocks(newJson)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </EditableBlocksProvider>
  );
}
