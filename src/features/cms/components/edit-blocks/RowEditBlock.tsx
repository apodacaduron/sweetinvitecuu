import { useEditableBlocks } from '../../context/EditableBlocksContext';
import BlockRenderer, { EditBlockProps } from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function RowEditBlock(props: EditBlockProps<any>) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper
      isVisible={props.visible}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      childClassName="flex gap-4 border-2 border-dashed border-gray-400 rounded-md p-6"
    >
      <BlockRenderer blocks={props.properties.blocks} />
    </EditBlockWrapper>
  );
}
