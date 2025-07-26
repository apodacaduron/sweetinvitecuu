import { Block, BlockBase, GroupProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import AddBlockButton from './AddBlockButton';
import EditBlockRenderer from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function GroupEditBlock(
  props: BlockBase<GroupProperties> & { type: "group" }
) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
      childClassName="space-y-4 border-2 border-dashed border-gray-400 rounded-md p-6"
      block={props as Block}
    >
      <EditBlockRenderer blocks={props.properties.blocks} />
      {!props.properties.blocks.length && (
        <AddBlockButton adjacentBlockId={props.id} mode="inside" />
      )}
    </EditBlockWrapper>
  );
}
