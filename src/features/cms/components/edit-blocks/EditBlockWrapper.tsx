import Case from 'case';
import {
    CalendarIcon, Columns, Eye, EyeClosed, FileTextIcon, GridIcon, ImageIcon, LayersIcon, Link2Icon,
    MapPinIcon, Pencil, Plus, Rows, Trash, UserCheckIcon
} from 'lucide-react';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub,
    DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';

import { Block, BlockType, blockTypesWithIcons, getBlocksMap } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import AddBlockButton from './AddBlockButton';
import EditBlockDetailsDialog from './EditBlockDetailsDialog';

type Props = {
  children: React.ReactNode;
  className?: string;
  childClassName?: string;
  insetButton?: boolean;
  onClickVisibility(isVisible: boolean): void;
  block: Block;
};

export const blockTypeIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  // Básicos
  image: ImageIcon, // Para imágenes
  text: FileTextIcon, // Para bloques de texto
  link: Link2Icon, // Para enlaces

  // Contenedores y grupos
  group: LayersIcon, // Para grupos o contenedores de bloques
  row: GridIcon, // Para filas u organización horizontal

  // Funcionales específicos
  timeline: CalendarIcon, // Para líneas de tiempo, eventos
  gallery: ImageIcon, // Galerías de imágenes, reutilizo ImageIcon
  rsvp: UserCheckIcon, // Para formularios RSVP o confirmación de asistencia

  // Otros (puedes agregar más si aparecen más tipos)
  default: MapPinIcon, // Ícono por defecto si no se reconoce el tipo
};

function BlockIcon({ type }: { type: string }) {
  const Icon = blockTypeIconMap[type] || blockTypeIconMap.default;
  if (!Icon) return null;

  return <Icon className="h-5 w-5 text-gray-500" />;
}

export function EditBlockWrapper(props: Props) {
  const { deleteBlockById, wrapBlockById, pushBlockById, pushBlock } = useEditableBlocks();
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  function addNewBlock(blockType: BlockType) {
    const newBlock = getBlocksMap()[blockType];
    newBlock.original = false;

    if (props.block?.id) {
      pushBlockById(props.block.id, newBlock, { mode: 'inside', position: 'start' });
    } else {
      pushBlock(newBlock);
    }
  }

  return (
    <div className={twMerge("relative space-y-4", props.className)}>
      <h4 className="font-semibold text-xl mb-1 flex items-center gap-2">
        <BlockIcon type={props.block.type} />{" "}
        {`${Case.title(props.block.type)}`}
      </h4>
      <div
        className={twMerge(
          props.block.visible
            ? "opacity-100"
            : "opacity-70 diagonal-lines pointer-events-none",
          props.childClassName
        )}
      >
        {props.children}
      </div>

      <AddBlockButton adjacentBlockId={props.block.id} mode="adjacent" />

      <EditBlockDetailsDialog
        item={props.block}
        dialogProps={{
          open: detailsDialogOpen,
          onOpenChange: setDetailsDialogOpen,
        }}
        onSuccess={() => setDetailsDialogOpen(false)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`data-[state=open]:bg-muted text-muted-foreground flex size-8 absolute ${
              props.insetButton ? "top-0 right-0" : "-top-4 -right-4"
            }`}
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setDetailsDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit block details
          </DropdownMenuItem>

          {/* --- Submenu for Inserting New Blocks --- */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Plus className="mr-2 h-4 w-4" /> Insert New Block
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              {blockTypesWithIcons.map((block) => (
                <DropdownMenuItem
                  key={block.type}
                  onClick={() => addNewBlock(block.type)}
                >
                  <block.icon className="mr-2 h-4 w-4" />
                  {block.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              wrapBlockById(props.block.id, (child) => {
                const newRowBlock = getBlocksMap()["group"];
                newRowBlock.original = false;

                if (
                  newRowBlock.properties &&
                  "blocks" in newRowBlock.properties
                ) {
                  newRowBlock.properties.blocks.push(child);
                }

                return newRowBlock;
              })
            }
          >
            <Rows className="mr-2 h-4 w-4" /> Wrap in Group
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              wrapBlockById(props.block.id, (child) => {
                const newRowBlock = getBlocksMap()["row"];
                newRowBlock.original = false;

                if (
                  newRowBlock.properties &&
                  "blocks" in newRowBlock.properties
                ) {
                  newRowBlock.properties.blocks.push(child);
                }

                return newRowBlock;
              })
            }
          >
            <Columns className="mr-2 h-4 w-4" /> Wrap in Row
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => props.onClickVisibility(!props.block.visible)}
          >
            {props.block.visible ? (
              <>
                <EyeClosed className="mr-2 h-4 w-4" /> Hide
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> Show
              </>
            )}
          </DropdownMenuItem>

          {!props.block.original && (
            <DropdownMenuItem
              onClick={() => deleteBlockById(props.block.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
