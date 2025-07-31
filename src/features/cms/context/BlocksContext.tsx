import {
    Circle, Columns, GalleryHorizontal, Hourglass, Image, LayoutList, Link, LucideIcon, MailPlus,
    Rows, Text
} from 'lucide-react';
import React, { createContext, CSSProperties, ReactNode, useContext } from 'react';

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

export type BlockType =
  | "gradient-title"
  | "elegant-title"
  | "text"
  | "text-query"
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
  style: CSSProperties;
  visible: boolean;
  original: boolean;
  properties: T;
  animation?: string | null
}

function buildBlock<K extends keyof BlockDefinition>(
  type: K,
  properties: BlockDefinition[K],
  overrides?: Partial<
    Pick<
      BlockBase<BlockDefinition[K]>,
      "tag" | "class" | "visible" | "original" | "style" | "animation"
    >
  >
): BlockBase<BlockDefinition[K]> & { type: K } {
  return {
    id: crypto.randomUUID(),
    type,
    tag: overrides?.tag ?? "",
    class: overrides?.class ?? "",
    style: overrides?.style ?? {},
    visible: overrides?.visible ?? true,
    original: overrides?.original ?? true,
    properties,
    animation: overrides?.animation ?? null,
  };
}

export function getBlocksMap(): Record<keyof BlockDefinition, Block> {
  return {
    "gradient-title": buildBlock("gradient-title", { content: "" }),
    "elegant-title": buildBlock("elegant-title", { content: "" }),
    text: buildBlock("text", { content: "" }),
    "text-query": buildBlock("text-query", { content: "", query: "" }),
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
  };
}

export type BlockTypeWithIcon = {
  type: BlockType;
  label: string;
  icon: LucideIcon;
};

export const blockTypesWithIcons: BlockTypeWithIcon[] = [
  {
    type: "gradient-title",
    label: "Gradient Title Overlay",
    icon: Circle,
  },
  {
    type: "text",
    label: "Text",
    icon: Text,
  },
  {
    type: "text-query",
    label: "Text query",
    icon: Text,
  },
  {
    type: "group",
    label: "Group",
    icon: Rows,
  },
  {
    type: "row",
    label: "Row",
    icon: Columns,
  },
  {
    type: "image",
    label: "Image",
    icon: Image,
  },
  {
    type: "link",
    label: "Link",
    icon: Link,
  },
  {
    type: "timeline",
    label: "Timeline",
    icon: LayoutList,
  },
  {
    type: "countdown",
    label: "Countdown",
    icon: Hourglass,
  },
  {
    type: "gallery",
    label: "Gallery",
    icon: GalleryHorizontal,
  },
  {
    type: "rsvp",
    label: "RSVP",
    icon: MailPlus,
  },
];

export type Block = {
  [K in keyof BlockDefinition]: BlockBase<BlockDefinition[K]> & { type: K };
}[keyof BlockDefinition];

type BlockDefinition = {
  "gradient-title": GradientTitleOverlayProperties;
  "elegant-title": ElegantTitleOverlayProperties;
  text: TextProperties;
  "text-query": TextQueryProperties;
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

export type TextQueryProperties = {
  content: string;
  query?: string;
};

export type GradientTitleOverlayProperties = {
  content: string
};

export type ElegantTitleOverlayProperties = {
  content: string
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

export function resolveClassNames(
  classNames: string,
  styles: Record<string, string>
) {
  if (!classNames) return;

  return classNames
    .trim()
    .split(" ")
    .map((cls) => styles[cls] || cls)
    .join(" ");
}
