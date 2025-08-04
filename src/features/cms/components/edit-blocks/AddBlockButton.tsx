import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { BlockType, blockTypesWithIcons, getBlocksMap } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';

type Props = {
    adjacentBlockId?: string
    mode: "adjacent" | "inside"
}

export default function AddBlockButton(props: Props) {
  const { pushBlockById, pushBlock } = useEditableBlocks();

  function addNewBlock(blockType: BlockType) {
    const newBlock = getBlocksMap()[blockType];
    newBlock.original = false;

    if (props.adjacentBlockId) {
        pushBlockById(props.adjacentBlockId, newBlock, { mode: props.mode });
    } else {
        pushBlock(newBlock)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus />
          Add new block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {blockTypesWithIcons.map((block) => (
          <DropdownMenuItem
            key={block.type}
            onClick={() => addNewBlock(block.type)}
          >
            <block.icon />
            {block.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
