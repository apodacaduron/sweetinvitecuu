import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input'; // ← You'll need this
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Block, BlockBase, TextQueryProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function TextQueryEditBlock(
  props: BlockBase<TextQueryProperties> & { type: "text-query" }
) {
  const { updateBlock } = useEditableBlocks();

  const [content, setContent] = useState(props.properties.content || "");
  const [query, setQueryKey] = useState(props.properties.query || "");

  useEffect(() => {
    setContent(props.properties.content || "");
    setQueryKey(props.properties.query || "");
  }, [props.properties.content, props.properties.query]);

  useEffect(() => {
    updateBlock({
      ...props,
      properties: {
        ...props.properties,
        content,
        query: query.trim() || "", // clean empty string
      },
    });
  }, [content, query]);

  return (
    <EditBlockWrapper
      className="w-full"
      insetButton
      block={props as Block}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
    >
      <div
        className={
          props.visible
            ? "opacity-100"
            : "opacity-70 diagonal-lines pointer-events-none relative"
        }
      >
        <Label htmlFor={`${props.id}-content`} className="mb-2">
          Contenido predeterminado
        </Label>
        <Textarea
          id={`${props.id}-content`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe aquí el texto..."
          className="mb-4 resize-y"
          rows={4}
          disabled={!props.visible}
        />

        <Label htmlFor={`${props.id}-query`} className="mb-2">
          Nombre del parámetro (opcional)
        </Label>
        <Input
          id={`${props.id}-query`}
          value={query}
          onChange={(e) => setQueryKey(e.target.value)}
          placeholder="Ejemplo: title"
          disabled={!props.visible}
        />
      </div>
    </EditBlockWrapper>
  );
}
