import { useEffect, useRef, useState } from 'react';

import { Label } from '@/components/ui/label';
import { useFileUploader } from '@/hooks/useFileUploader';

import { Block, BlockBase, ImageProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function ImageEditBlock(props: BlockBase<ImageProperties> & { type: "image" }) {
  const { updateBlock, parentData, origin } = useEditableBlocks();
  const [image, setImage] = useState(props.properties.file.publicUrl || "");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const { handleFileChange, handleFile } = useFileUploader({
    origin,
    foldername: parentData?.id ?? "",
    filename: props.id,
    onUpdate(fileResponse) {
      setImage(fileResponse.publicUrl);
      updateBlock({
        ...props,
        properties: { ...props.properties, file: fileResponse },
      });
    },
    bucket: "media",
    ...(origin === 'events' ? { eventId: parentData?.id || null } : { templateId: parentData?.id || null })
  });

  useEffect(() => {
    setImage(props.properties.file.publicUrl || "");
  }, [props.properties.file.publicUrl]);

  // Handlers drag & drop
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!props.visible) return;
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Abrir selector al clickear imagen o área
  const onClickArea = () => {
    if (!props.visible) return;
    inputFileRef.current?.click();
  };

  return (
    <EditBlockWrapper
      insetButton
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      block={props as Block}
    >
      <Label htmlFor={`${props.id}-file-upload`} className="mb-2 block">
        {image
          ? "Haz clic en la imagen para reemplazarla, o arrastra una imagen aquí"
          : "Sube una imagen arrastrando o haciendo clic aquí"}
      </Label>

      {/* Input file oculto */}
      <input
        id={`${props.id}-file-upload`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={!props.visible}
        ref={inputFileRef}
        style={{ display: "none" }}
      />

      {/* Dropzone + imagen clickable */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onClickArea}
        className={`cursor-pointer w-full max-h-64 rounded border border-dashed border-gray-400 flex items-center justify-center overflow-hidden ${
          image ? "" : "min-h-[150px]"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt="Vista previa imagen"
            className="object-contain w-full max-h-64"
          />
        ) : (
          <span className="text-gray-500">
            Arrastra la imagen aquí o haz clic para seleccionar archivo
          </span>
        )}
      </div>
    </EditBlockWrapper>
  );
}
