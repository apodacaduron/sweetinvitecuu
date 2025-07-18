import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockProps } from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export type ImageProperties = {
  image: string;
};

export default function ImageEditBlock(props: EditBlockProps<ImageProperties>) {
  const { updateBlock } = useEditableBlocks();
  const [image, setImage] = useState(props.properties.image || "");

  useEffect(() => {
    setImage(props.properties.image || "");
  }, [props.properties.image]);

  useEffect(() => {
    updateBlock({ ...props, properties: { ...props.properties, image } });
  }, [image]);

  return (
    <EditBlockWrapper
      insetButton
      isVisible={props.visible}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
    >
      <Label htmlFor={`${props.id}-image-url`} className="mb-2">
        URL de la imagen
      </Label>
      <Input
        id={`${props.id}-image-url`}
        type="text"
        placeholder="https://example.com/mi-imagen.jpg"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="mb-4"
        disabled={!props.visible}
      />
      {image && (
        <img
          id={props.id}
          src={image}
          alt="Vista previa imagen"
          className="w-full max-h-64 rounded border object-contain"
        />
      )}
    </EditBlockWrapper>
  );
}
