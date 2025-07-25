import { useEditableBlocks } from '../../context/EditableBlocksContext';
import EditBlockRenderer, { EditBlockProps } from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function RowEditBlock(props: EditBlockProps<any>) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      block={props}
      childClassName="flex gap-4 border-2 border-dashed border-gray-400 rounded-md p-6"
    >
      <EditBlockRenderer blocks={props.properties.blocks} />
    </EditBlockWrapper>
  );
}
