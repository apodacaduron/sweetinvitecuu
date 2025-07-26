"use client";

import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DeleteTemplateDialog, TemplateDialog, TemplatesTable } from '@/features/templates'; // adjust path as needed
import { Template } from '@/features/templates/components/TemplatesTable';

export default function Page() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Template | null>(null);

  const queryKeyGetter = useCallback(() => {
    return searchInput ? ["templates", { searchInput }] : ["templates"];
  }, [searchInput]);

  function openEditDialog(template: Template) {
    setCurrentItem(template);
    setFormDialogOpen(true);
  }

  function openDeleteDialog(template: Template) {
    setCurrentItem(template);
    setDeleteDialogOpen(true);
  }

  function handleFormDialogChange(open: boolean) {
    setFormDialogOpen(open);
    if (!open) setCurrentItem(null);
  }

  function handleDeleteDialogChange(open: boolean) {
    setDeleteDialogOpen(open);
    if (!open) setCurrentItem(null);
  }

  function openEditor(item: Template) {
    router.push(`/manage/templates/${item.id}`);
  }

  function openPreview(item: Template) {
    window.open(`${window.location.origin}/templates/${item.slug}`);
  }

  return (
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
            {
              label: "Templates",
            },
          ]}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="flex justify-between">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search..."
                  className="max-w-64"
                  type="search"
                />

                {/* Create and edit dialog */}
                <TemplateDialog
                  onSuccess={() => {
                    setFormDialogOpen(false);
                    setCurrentItem(null);
                  }}
                  item={currentItem}
                  queryKeyGetter={queryKeyGetter}
                  dialogProps={{
                    open: formDialogOpen,
                    onOpenChange: handleFormDialogChange,
                  }}
                />
                <Button onClick={() => setFormDialogOpen(true)}>
                  <PlusIcon className="size-4" />
                  Create
                </Button>
              </div>

              <DeleteTemplateDialog
                onSuccess={() => {
                  setDeleteDialogOpen(false);
                  setCurrentItem(null);
                }}
                queryKeyGetter={queryKeyGetter}
                itemId={currentItem?.id}
                itemName={currentItem?.name}
                dialogProps={{
                  open: deleteDialogOpen,
                  onOpenChange: handleDeleteDialogChange,
                }}
              />

              {/* Templates table */}
              <TemplatesTable
                onOpenPreview={openPreview}
                onOpenEditor={openEditor}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                queryKeyGetter={queryKeyGetter}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
