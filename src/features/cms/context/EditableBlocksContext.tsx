import React, { createContext, ReactNode, useContext, useState } from 'react';

import { Json, Tables } from '../../../../database.types';

type Block = any; // Replace with your proper block type if available

type EditableBlocksContextType = {
  parentData: Tables<'events'> | Tables<'templates'> | undefined;
  editableBlocks: Block[];
  updateBlock: (updatedBlock: Block) => void;
  setEditableBlocks: React.Dispatch<React.SetStateAction<Json>>
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
    return blocks.map((block) => {
      if (block.id === updatedBlock.id) {
        return updatedBlock;
      }
      if (block.properties?.blocks) {
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
    props.setEditableBlocks((prevBlocks: any) => updateBlockById(prevBlocks, updatedBlock));
  };

  return (
    <EditableBlocksContext.Provider value={{ editableBlocks: props.editableBlocks, updateBlock, setEditableBlocks: props.setEditableBlocks, parentData: props.parentData }}>
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
