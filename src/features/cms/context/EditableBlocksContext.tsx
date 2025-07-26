import React, { createContext, ReactNode, useContext } from 'react';

import { Tables } from '../../../../database.types';
import { Block } from './BlocksContext';

type EditableBlocksContextType = {
  parentData: Tables<'events'> | Tables<'templates'> | undefined;
  editableBlocks: Block[];
  updateBlock: (updatedBlock: Block) => void;
  setEditableBlocks: React.Dispatch<React.SetStateAction<Block[]>>
  origin: 'events' | 'templates'
};

type Props = {
    children: ReactNode
    parentData: EditableBlocksContextType['parentData']
    editableBlocks: EditableBlocksContextType['editableBlocks']
    setEditableBlocks: EditableBlocksContextType['setEditableBlocks']
    origin: 'events' | 'templates'
}

const EditableBlocksContext = createContext<EditableBlocksContextType | undefined>(undefined);

export function EditableBlocksProvider(props: Props) {
  function updateBlockById(blocks: Block[], updatedBlock: Block): Block[] {
    // @ts-expect-error: Some blocks might not have `properties.blocks`, skip type check here
    return blocks.map((block) => {
      if (block.id === updatedBlock.id) {
        return updatedBlock;
      }
      if (block.properties && 'blocks' in block.properties) {
        return {
          ...block,
          properties: {
            ...block.properties,
            blocks: updateBlockById(block.properties.blocks, updatedBlock),
          },
        };
      }
      return block;
    });
  }

  const updateBlock = (updatedBlock: Block) => {
    props.setEditableBlocks((prevBlocks: Block[]) => updateBlockById(prevBlocks, updatedBlock));
  };

  return (
    <EditableBlocksContext.Provider value={{ editableBlocks: props.editableBlocks, updateBlock, setEditableBlocks: props.setEditableBlocks, parentData: props.parentData, origin: props.origin }}>
      {props.children}
    </EditableBlocksContext.Provider>
  );
}

export function useEditableBlocks() {
  const context = useContext(EditableBlocksContext);
  if (!context) {
    throw new Error('useEditableBlocks must be used within an EditableBlocksProvider');
  }
  return context;
}
