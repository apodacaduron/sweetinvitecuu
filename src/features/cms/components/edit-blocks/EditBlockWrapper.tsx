import Case from 'case';
import {
    CalendarIcon, Eye, EyeClosed, FileTextIcon, GridIcon, ImageIcon, LayersIcon, Link2Icon,
    MapPinIcon, UserCheckIcon
} from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';

import { EditBlockProps } from './EditBlockRenderer';

type Props = {
  children: React.ReactNode;
  className?: string
  childClassName?: string
  insetButton?: boolean
  isVisible: boolean
  onClickVisibility(isVisible: boolean): void
  block: EditBlockProps<any>
};


export const blockTypeIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  // Básicos
  image: ImageIcon,           // Para imágenes
  text: FileTextIcon,         // Para bloques de texto
  link: Link2Icon,            // Para enlaces

  // Contenedores y grupos
  group: LayersIcon,          // Para grupos o contenedores de bloques
  row: GridIcon,              // Para filas u organización horizontal

  // Funcionales específicos
  timeline: CalendarIcon,     // Para líneas de tiempo, eventos
  gallery: ImageIcon,         // Galerías de imágenes, reutilizo ImageIcon
  rsvp: UserCheckIcon,        // Para formularios RSVP o confirmación de asistencia

  // Otros (puedes agregar más si aparecen más tipos)
  default: MapPinIcon,        // Ícono por defecto si no se reconoce el tipo
};

function BlockIcon({ type }: { type: string }) {
  const Icon = blockTypeIconMap[type] || blockTypeIconMap.default;
  return <Icon className="h-5 w-5 text-gray-500" />;
}

export function EditBlockWrapper(props: Props) {
  return (
    <div className={twMerge("relative", props.className)}>
      <h4 className='font-semibold text-xl mb-1 flex items-center gap-2'><BlockIcon type={props.block.type} /> {`${Case.title(props.block.type)}`}</h4>
      <div className={twMerge(props.isVisible ? 'opacity-100' : 'opacity-70 diagonal-lines pointer-events-none', props.childClassName)}>
        {props.children}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`data-[state=open]:bg-muted text-muted-foreground flex size-8 absolute ${props.insetButton ? 'top-0 right-0' : '-top-4 -right-4'}`}
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => props.onClickVisibility(!props.isVisible)}>
            {props.isVisible ? <><EyeClosed /> Hide</> : <><Eye /> Show</>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
