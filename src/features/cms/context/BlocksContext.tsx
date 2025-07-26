import React, { createContext, ReactNode, useContext } from 'react';

import { Tables } from '../../../../database.types';

type BlocksContextType = {
  parentData: Tables<"events"> | Tables<"templates"> | undefined;
  origin: "events" | "templates";
};

type Props = {
  children: ReactNode;
  parentData: BlocksContextType["parentData"];
  origin: "events" | "templates";
};

const BlocksContext = createContext<BlocksContextType | undefined>(undefined);

export function BlocksProvider(props: Props) {
  return (
    <BlocksContext.Provider
      value={{ origin: props.origin, parentData: props.parentData }}
    >
      {props.children}
    </BlocksContext.Provider>
  );
}

export function useBlocks() {
  const context = useContext(BlocksContext);
  if (!context) {
    throw new Error("useBlocks must be used within an BlocksProvider");
  }
  return context;
}

type BlockType =
  | "circle-overlay"
  | "text"
  | "group"
  | "image"
  | "row"
  | "link"
  | "timeline"
  | "countdown"
  | "gallery"
  | "rsvp";

export interface BlockBase<T> {
  id: string;
  tag: string;
  type: BlockType;
  class: string;
  visible: boolean;
  original: boolean;
  properties: T;
}

function buildBlock<K extends keyof BlockDefinition>(
  type: K,
  properties: BlockDefinition[K],
  overrides?: Partial<Pick<BlockBase<BlockDefinition[K]>, "tag" | "class" | "visible" | "original">>
): BlockBase<BlockDefinition[K]> & { type: K } {
  return {
    id: crypto.randomUUID(),
    type,
    tag: overrides?.tag ?? "",
    class: overrides?.class ?? "",
    visible: overrides?.visible ?? true,
    original: overrides?.original ?? true,
    properties,
  };
}

export const blocksMap = {
  "circle-overlay": buildBlock("circle-overlay", { blocks: [] }),
  text: buildBlock("text", { content: "" }),
  group: buildBlock("group", { blocks: [] }),
  row: buildBlock("row", { blocks: [] }),
  image: buildBlock("image", {
    file: {
      id: "",
      fileName: "",
      filePath: "",
      publicUrl: "",
      bucket: "",
    },
  }),
  link: buildBlock("link", {
    url: "",
    target: "",
    content: "",
  }),
  timeline: buildBlock("timeline", {
    items: [],
  }),
  countdown: buildBlock("countdown", {
    timestamp: "",
  }),
  gallery: buildBlock("gallery", {
    images: [],
  }),
  rsvp: buildBlock("rsvp", null),
} satisfies Record<keyof BlockDefinition, Block>;

export type Block = {
  [K in keyof BlockDefinition]: BlockBase<BlockDefinition[K]> & { type: K }
}[keyof BlockDefinition];

type BlockDefinition = {
  "circle-overlay": CircleOverlayProperties;
  text: TextProperties;
  group: GroupProperties;
  row: RowProperties;
  image: ImageProperties;
  link: LinkProperties;
  timeline: TimelineProperties;
  countdown: CountdownProperties;
  gallery: GalleryProperties;
  rsvp: RsvpProperties;
};

export type GroupProperties = {
  blocks: Block[];
};

export type RowProperties = {
  blocks: Block[];
};

export type TextProperties = {
  content: string;
};

export type CircleOverlayProperties = {
  blocks: Block[];
};

export type ImageProperties = {
  file: {
    id: string;
    fileName: string;
    filePath: string;
    publicUrl: string;
    bucket: string;
  };
};

export type LinkProperties = {
  url: string;
  target: string;
  content: string;
};

export type TimelineProperties = {
  items: Array<{
    image: {
      id: string;
      bucket: string;
      fileName: string;
      filePath: string;
      publicUrl: string;
    };
    content: string;
  }>;
};

export type CountdownProperties = {
  timestamp: string;
};

export type GalleryProperties = {
  images: Array<{
    bucket: string;
    id: string;
    fileName: string;
    filePath: string;
    publicUrl: string;
  }>;
};

export type RsvpProperties = null;