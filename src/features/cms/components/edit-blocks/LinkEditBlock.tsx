'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

import { Block, BlockBase, LinkProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function LinkEditBlock(props: BlockBase<LinkProperties> & { type: "link" }) {
  const { updateBlock } = useEditableBlocks();

  const [content, setContent] = useState(props.properties.content || '');
  const [url, setUrl] = useState(props.properties.url || '');
  const [target, setTarget] = useState(props.properties.target ?? '_blank');

  // Sync props on update
  useEffect(() => {
    setContent(props.properties.content || '');
    setUrl(props.properties.url || '');
    setTarget(props.properties.target ?? '_blank');
  }, [props.properties]);

  // Update block when values change
  useEffect(() => {
    updateBlock({
      ...props,
      properties: {
        ...props.properties,
        content,
        url,
        target,
      },
    });
  }, [content, url, target]);

  return (
    <EditBlockWrapper
      className="w-full"
      insetButton
      block={props as Block}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
    >
      <div className={props.visible ? '' : 'opacity-70 diagonal-lines pointer-events-none relative'}>
        <div className="mb-4">
          <Label htmlFor={`${props.id}-content`} className="mb-1">
            Texto del enlace
          </Label>
          <Input
            id={`${props.id}-content`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ej: Ver ubicación"
            disabled={!props.visible}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor={`${props.id}-url`} className="mb-1">
            URL
          </Label>
          <Input
            id={`${props.id}-url`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            disabled={!props.visible}
          />
        </div>

        <div className="mb-4">
          <Label className="mb-1">Destino</Label>
          <Select
            value={target}
            onValueChange={(value) => setTarget(value)}
            disabled={!props.visible}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_blank">Abrir en nueva pestaña</SelectItem>
              <SelectItem value="_self">Abrir en la misma pestaña</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </EditBlockWrapper>
  );
}
