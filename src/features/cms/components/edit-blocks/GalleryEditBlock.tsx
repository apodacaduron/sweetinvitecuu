import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockProps } from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export type GalleryProperties = {
  title: string;
  images: string[];
};

export default function GalleryBlock(props: EditBlockProps<GalleryProperties>) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper
      isVisible={props.visible}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
    >
      Gallery
    </EditBlockWrapper>
  );
}
