'use client';

import { useRef, useState } from 'react';

import { Label } from '@/components/ui/label';
import { FileResponseData, useFileUploader } from '@/hooks/useFileUploader';
import { cn } from '@/lib/utils'; // si usas clsx o util similar

import { Block, BlockBase, GalleryProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function GalleryEditBlock(props: BlockBase<GalleryProperties> & { type: "gallery" }) {
  const { updateBlock, parentData, origin } = useEditableBlocks();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const images = props.properties?.images ?? [];

  const [localImages, setLocalImages] = useState<FileResponseData[]>(images);

  const updateImages = (newImages: GalleryProperties['images']) => {
    setLocalImages(newImages);
    updateBlock({
      ...props,
      properties: {
        ...props.properties,
        images: newImages,
      },
    });
  };

  const { handleFile } = useFileUploader({
    origin,
    foldername: parentData?.id ?? '',
    filename: props.id,
    onUpdate(fileResponse) {
      const updated = [...localImages, fileResponse];
      updateImages(updated);
    },
    bucket: 'media',
    ...(origin === 'events' ? { eventId: parentData?.id || null } : { templateId: parentData?.id || null })
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!props.visible) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onClickArea = () => {
    if (!props.visible) return;
    inputFileRef.current?.click();
  };

  const removeImage = (index: number) => {
    const updated = [...localImages];
    updated.splice(index, 1);
    updateImages(updated);
  };

  return (
    <EditBlockWrapper
      insetButton
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      block={props as Block}
    >
      <Label className="mb-2 block">
        Agrega imágenes a la galería arrastrando o haciendo clic aquí
      </Label>

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={!props.visible}
        ref={inputFileRef}
        style={{ display: 'none' }}
      />

      {/* Dropzone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={onClickArea}
        className={cn(
          'cursor-pointer w-full min-h-[150px] rounded border border-dashed border-gray-400 mb-4 flex items-center justify-center text-gray-500'
        )}
      >
        Arrastra imágenes o haz clic para seleccionar
      </div>

      {/* Galería de imágenes */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {localImages.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img.publicUrl}
              alt={`Imagen ${index + 1}`}
              className="object-cover w-full h-32 rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </EditBlockWrapper>
  );
}
