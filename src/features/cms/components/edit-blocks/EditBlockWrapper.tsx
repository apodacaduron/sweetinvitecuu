import Case from 'case';
import { Eye, EyeClosed } from 'lucide-react';
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

export function EditBlockWrapper(props: Props) {
  return (
    <div className={twMerge("relative", props.className)}>
      <h4 className='font-semibold text-xl mb-1'>{`${Case.title(props.block.type)}`}</h4>
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
