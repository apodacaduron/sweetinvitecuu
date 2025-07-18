import React, { createContext, ReactNode, useContext, useState } from 'react';

type Block = any; // Replace with your proper block type if available

type EditableBlocksContextType = {
  editableBlocks: Block[];
  updateBlock: (updatedBlock: Block) => void;
  setEditableBlocks: React.Dispatch<React.SetStateAction<any[]>>
};

type Props = {
    children: ReactNode
    editableBlocks: any
    setEditableBlocks: any
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
    <EditableBlocksContext.Provider value={{ editableBlocks: props.editableBlocks, updateBlock, setEditableBlocks: props.setEditableBlocks }}>
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
