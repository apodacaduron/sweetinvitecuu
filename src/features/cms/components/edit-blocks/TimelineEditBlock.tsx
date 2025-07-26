"use client";

import { GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFileUploader } from '@/hooks/useFileUploader';
import { cn } from '@/lib/utils';

import { Block, BlockBase, TimelineProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

type DragItem = {
  index: number;
  type: string;
};

function DraggableTimelineItem({
  item,
  index,
  moveItem,
  updateItemContent,
  handleImageUpload,
  removeItem,
  visible,
}: {
  item: TimelineProperties["items"][number];
  index: number;
  moveItem: (from: number, to: number) => void;
  updateItemContent: (index: number, content: string) => void;
  handleImageUpload: (index: number, file: File) => void;
  removeItem: (index: number) => void;
  visible: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: "timeline-item",
    hover(dragged) {
      if (dragged.index !== index) {
        moveItem(dragged.index, index);
        dragged.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "timeline-item",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Apply drag only to handle
  drag(handleRef);
  drop(containerRef);

  return (
    <div
      ref={containerRef}
      className={cn(
        "border rounded p-4 relative bg-muted/20",
        isDragging && "opacity-50"
      )}
    >
      {/* Drag Handle */}
      <div
        ref={handleRef}
        className="absolute -left-4 top-2 cursor-grab text-muted-foreground"
        title="Arrastrar"
      >
        <GripVertical size={16} />
      </div>

      <Label className="mb-1 block">Contenido</Label>
      <Textarea
        value={item.content}
        onChange={(e) => updateItemContent(index, e.target.value)}
        disabled={!visible}
        placeholder="Ej. Ceremonia - 4:00 PM - Iglesia San José"
      />

      <Label className="mt-3 block">Imagen</Label>
      <Input
        type="file"
        accept="image/*"
        disabled={!visible}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(index, file);
        }}
      />

      {item.image?.publicUrl && (
        <img
          src={item.image.publicUrl}
          alt={`Timeline image ${index}`}
          className="mt-2 max-h-32 rounded border object-cover"
        />
      )}

      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => removeItem(index)}
      >
        Eliminar
      </Button>
    </div>
  );
}

function TimelineEditBlockInner(
  props: BlockBase<TimelineProperties> & { type: "timeline" }
) {
  const fileUploader = useFileUploader();
  const { updateBlock, parentData, origin } = useEditableBlocks();
  const [items, setItems] = useState<TimelineProperties["items"]>(
    props.properties.items ?? []
  );

  const syncToContext = (newItems: TimelineProperties["items"]) => {
    setItems(newItems);
    updateBlock({ ...props, properties: { items: newItems } });
  };

  const addItem = () => {
    syncToContext([
      ...items,
      { content: "", image: {} } as TimelineProperties["items"][number],
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    syncToContext(updated);
  };

  const moveItem = (from: number, to: number) => {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    if (moved) {
      updated.splice(to, 0, moved);
      syncToContext(updated);
    }
  };

  const updateItemContent = (index: number, content: string) => {
    const updated = [...items];
    if (updated[index]) {
      updated[index].content = content;
      syncToContext(updated);
    }
  };

  const handleImageUpload = (index: number, file: File) => {
    fileUploader.handleFile(file, {
      origin,
      foldername: parentData?.id ?? "",
      filename: `${props.id}-${index}`,
      onUpdate: (fileResponse) => {
        const updated = [...items];
        if (updated[index]) {
          updated[index].image = fileResponse;
          syncToContext(updated);
        }
      },
      bucket: "media",
      ...(origin === "events"
        ? { eventId: parentData?.id || null }
        : { templateId: parentData?.id || null }),
    });
  };

  return (
    <EditBlockWrapper
      insetButton
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      block={props as Block}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <DraggableTimelineItem
            key={index}
            item={item}
            index={index}
            moveItem={moveItem}
            updateItemContent={updateItemContent}
            handleImageUpload={handleImageUpload}
            removeItem={removeItem}
            visible={props.visible}
          />
        ))}

        <Button
          onClick={addItem}
          type="button"
          className="w-full"
          variant="outline"
        >
          ➕ Agregar evento
        </Button>
      </div>
    </EditBlockWrapper>
  );
}

// Main export with DndProvider
export default function TimelineEditBlock(
  props: BlockBase<TimelineProperties> & { type: "timeline" }
) {
  return (
    <DndProvider backend={HTML5Backend}>
      <TimelineEditBlockInner {...props} />
    </DndProvider>
  );
}
