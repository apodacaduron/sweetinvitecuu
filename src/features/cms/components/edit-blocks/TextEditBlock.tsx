import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Block, BlockBase, TextProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function TextEditBlock(props: BlockBase<TextProperties> & { type: "text" }) {
  const { updateBlock } = useEditableBlocks();
  const [content, setContent] = useState(props.properties.content || "");

  useEffect(() => {
    setContent(props.properties.content || "");
  }, [props.properties.content]);

  useEffect(() => {
    updateBlock({ ...props, properties: { ...props.properties, content } });
  }, [content]);

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
          Contenido
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
      </div>
    </EditBlockWrapper>
  );
}
