import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Block, BlockBase, CountdownProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function CountdownEditBlock(
  props: BlockBase<CountdownProperties> & { type: "countdown" }
) {
  const { updateBlock, parentData } = useEditableBlocks();

  const eventDate =
    parentData && "event_date" in parentData
      ? parentData?.event_date || ""
      : "";

  const [timestamp, setTimestamp] = useState(
    props.properties.timestamp || eventDate
  );

  // Convert ISO to datetime-local string (strip seconds and convert to local)
  const getLocalValue = (iso: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  useEffect(() => {
    setTimestamp(props.properties.timestamp || eventDate);
  }, [props.properties.timestamp, eventDate]);

  useEffect(() => {
    updateBlock({ ...props, properties: { ...props.properties, timestamp } });
  }, [timestamp]);

  return (
    <EditBlockWrapper
      className="w-full"
      insetButton
      block={props as Block}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
    >
      <div
        className={
          props.visible
            ? "opacity-100"
            : "opacity-70 diagonal-lines pointer-events-none relative"
        }
      >
        <Label htmlFor={`${props.id}-timestamp`} className="mb-2 block">
          Fecha y hora del conteo
        </Label>
        <Input
          id={`${props.id}-timestamp`}
          type="datetime-local"
          value={getLocalValue(timestamp)}
          onChange={(e) =>
            setTimestamp(
              e.target.value ? new Date(e.target.value).toISOString() : ""
            )
          }
          disabled={!props.visible}
        />
      </div>
    </EditBlockWrapper>
  );
}
