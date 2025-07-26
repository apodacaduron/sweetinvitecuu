import { Block, BlockBase, RowProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import EditBlockRenderer from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function RowEditBlock(props: BlockBase<RowProperties> & { type: "row" }) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      block={props as Block}
      childClassName="flex gap-4 border-2 border-dashed border-gray-400 rounded-md p-6"
    >
      <EditBlockRenderer blocks={props.properties.blocks} />
    </EditBlockWrapper>
  );
}
