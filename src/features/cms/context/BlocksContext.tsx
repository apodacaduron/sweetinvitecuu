import React, { createContext, ReactNode, useContext, useState } from 'react';

import { Json, Tables } from '../../../../database.types';

type Block = any; // Replace with your proper block type if available

type BlocksContextType = {
  parentData: Tables<'events'> | Tables<'templates'> | undefined;
  origin: 'events' | 'templates'
};

type Props = {
    children: ReactNode
    parentData: BlocksContextType['parentData']
    origin: 'events' | 'templates'
}

const BlocksContext = createContext<BlocksContextType | undefined>(undefined);

export function BlocksProvider(props: Props) {

  return (
    <BlocksContext.Provider value={{ origin: props.origin, parentData: props.parentData }}>
      {props.children}
    </BlocksContext.Provider>
  );
}

export function useBlocks() {
  const context = useContext(BlocksContext);
  if (!context) {
    throw new Error('useBlocks must be used within an BlocksProvider');
  }
  return context;
}
