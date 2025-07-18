import { useEditableBlocks } from '../../context/EditableBlocksContext';
import BlockRenderer, { EditBlockProps } from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function RowEditBlock(props: EditBlockProps<any>) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper
      isVisible={props.visible}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      className="border-2 border-dashed border-gray-400 rounded-md p-6"
      childClassName="flex gap-4"
    >
      <BlockRenderer blocks={props.properties.blocks} />
    </EditBlockWrapper>
  );
}
