import React, { createContext, ReactNode, useContext } from 'react';

import { Tables } from '../../../../database.types';
import { Block } from './BlocksContext';

type EditableBlocksContextType = {
  parentData: Tables<"events"> | Tables<"templates"> | undefined;
  editableBlocks: Block[];
  updateBlock: (updatedBlock: Block) => void;
  pushBlockById: (
    targetId: string,
    newBlock: Block,
    mode: "adjacent" | "inside"
  ) => void;
  wrapBlockById: (targetId: string, wrapperFactory: (child: Block) => Block) => void;
  pushBlock: (newBlock: Block) => void;
  deleteBlockById: (targetId: string) => void;
  setEditableBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  origin: "events" | "templates";
};

type Props = {
  children: ReactNode;
  parentData: EditableBlocksContextType["parentData"];
  editableBlocks: EditableBlocksContextType["editableBlocks"];
  setEditableBlocks: EditableBlocksContextType["setEditableBlocks"];
  origin: "events" | "templates";
};

const EditableBlocksContext = createContext<
  EditableBlocksContextType | undefined
>(undefined);

export function EditableBlocksProvider(props: Props) {
  function updateBlockById(blocks: Block[], updatedBlock: Block): Block[] {
    // @ts-expect-error: Some blocks might not have `properties.blocks`, skip type check here
    return blocks.map((block) => {
      if (block.id === updatedBlock.id) {
        return updatedBlock;
      }
      if (block.properties && "blocks" in block.properties) {
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

  function pushBlockToTarget(
    blocks: Block[],
    targetId: string,
    newBlock: Block,
    mode: "adjacent" | "inside" = "adjacent"
  ): Block[] {
    const result: Block[] = [];

    for (const block of blocks) {
      result.push(block);

      if (block.id === targetId) {
        if (mode === "adjacent") {
          // Insert next to the target block
          result.push(newBlock);
        } else if (
          mode === "inside" &&
          block.properties &&
          "blocks" in block.properties
        ) {
          // Insert inside target block's children
          const updatedBlock = {
            ...block,
            properties: {
              ...block.properties,
              blocks: [...block.properties.blocks, newBlock],
            },
          };
          // Replace the last pushed block with the updated one
          // @ts-expect-error: ignore
          result[result.length - 1] = updatedBlock;
        }
      } else if (block.properties && "blocks" in block.properties) {
        // Recurse in nested blocks regardless of mode,
        // because target might be nested deeper
        const nestedBlocks = pushBlockToTarget(
          block.properties.blocks,
          targetId,
          newBlock,
          mode
        );

        if (nestedBlocks !== block.properties.blocks) {
          const updatedBlock = {
            ...block,
            properties: {
              ...block.properties,
              blocks: nestedBlocks,
            },
          };
          // @ts-expect-error: ignore
          result[result.length - 1] = updatedBlock;
        }
      }
    }

    return result;
  }

  function removeBlockById(blocks: Block[], targetId: string): Block[] {
    // @ts-expect-error: Some blocks might not have `properties.blocks`, skip type check here
    return blocks
      .filter((block) => block.id !== targetId)
      .map((block) => {
        if (block.properties && "blocks" in block.properties) {
          return {
            ...block,
            properties: {
              ...block.properties,
              blocks: removeBlockById(block.properties.blocks, targetId),
            },
          };
        }
        return block;
      });
  }

  function wrapTargetInBlock(
    blocks: Block[],
    targetId: string,
    wrapperBlockFactory: (child: Block) => Block
  ): Block[] {
    // @ts-expect-error: Some blocks might not have `properties.blocks`, skip type check here
    return blocks.map((block) => {
      if (block.id === targetId) {
        return wrapperBlockFactory(block);
      }

      if (block.properties && "blocks" in block.properties) {
        const updatedChildren = wrapTargetInBlock(
          block.properties.blocks,
          targetId,
          wrapperBlockFactory
        );

        if (updatedChildren !== block.properties.blocks) {
          return {
            ...block,
            properties: {
              ...block.properties,
              blocks: updatedChildren,
            },
          };
        }
      }

      return block;
    });
  }

  const deleteBlockById = (targetId: string) => {
    props.setEditableBlocks((prevBlocks) =>
      removeBlockById(prevBlocks, targetId)
    );
  };

  const updateBlock = (updatedBlock: Block) => {
    props.setEditableBlocks((prevBlocks: Block[]) =>
      updateBlockById(prevBlocks, updatedBlock)
    );
  };

  const pushBlockById = (
    targetId: string,
    newBlock: Block,
    mode: "adjacent" | "inside" = "adjacent"
  ) => {
    props.setEditableBlocks((prevBlocks) =>
      pushBlockToTarget(prevBlocks, targetId, newBlock, mode)
    );
  };

  const pushBlock = (newBlock: Block) => {
    props.setEditableBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  const wrapBlockById = (
    targetId: string,
    wrapperFactory: (child: Block) => Block
  ) => {
    props.setEditableBlocks((prev) =>
      wrapTargetInBlock(prev, targetId, wrapperFactory)
    );
  };

  return (
    <EditableBlocksContext.Provider
      value={{
        editableBlocks: props.editableBlocks,
        updateBlock,
        pushBlockById,
        pushBlock,
        deleteBlockById,
        wrapBlockById,
        setEditableBlocks: props.setEditableBlocks,
        parentData: props.parentData,
        origin: props.origin,
      }}
    >
      {props.children}
    </EditableBlocksContext.Provider>
  );
}

export function useEditableBlocks() {
  const context = useContext(EditableBlocksContext);
  if (!context) {
    throw new Error(
      "useEditableBlocks must be used within an EditableBlocksProvider"
    );
  }
  return context;
}
