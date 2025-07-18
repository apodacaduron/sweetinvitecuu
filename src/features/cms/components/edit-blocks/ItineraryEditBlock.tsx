import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockProps } from './EditBlockRenderer';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function ItineraryBlock(props: EditBlockProps<any>) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper isVisible={props.visible}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}>
      Itinerary
    </EditBlockWrapper>
  );
}
