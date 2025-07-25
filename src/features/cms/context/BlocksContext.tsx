import React, { createContext, ReactNode, useContext, useState } from 'react';

import { Json, Tables } from '../../../../database.types';

type Block = any; // Replace with your proper block type if available

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

interface BlockBase<T> {
  id: string;
  tag: string;
  type: BlockType;
  class: string;
  visible: boolean;
  original: boolean;
  properties: T;
}

function buildBlock<T extends object>(
  type: BlockType,
  properties: T,
  overrides?: Partial<
    Pick<BlockBase<T>, "tag" | "class" | "visible" | "original">
  >
): BlockBase<T> {
  return {
    id: crypto.randomUUID(),
    tag: overrides?.tag ?? "",
    type,
    class: overrides?.class ?? "",
    visible: overrides?.visible ?? true,
    original: overrides?.original ?? true,
    properties,
  };
}

const blocksMap = {
  'circle-overlay': buildBlock("circle-overlay", { content: "" }),
  text: buildBlock("text", { content: "" }),
  group: buildBlock("group", { blocks: [] }),
  row: buildBlock("row", { blocks: [] }),
  image: buildBlock("image", {
    file: {
      fileName: "",
      filePath: "",
      publicUrl: "",
      bucket: "",
    },
  }),
  link: buildBlock("link", {
      url: "",
      target: "",
      bucket: "",
  }),
};


//   "timeline": {
//     "id": "",
//     "tag": "",
//     "type": "timeline",
//     "class": "",
//     "visible": true,
//     "original": true,
//     "properties": {
//       "items": [
//         {
//           "image": {
//             "bucket": "",
//             "fileName": "",
//             "filePath": "",
//             "publicUrl": ""
//           },
//           "content": ""
//         }
//       ]
//     }
//   },
//   "countdown": {
//     "id": "",
//     "tag": "",
//     "type": "countdown",
//     "class": "",
//     "visible": true,
//     "original": true,
//     "properties": {
//       "timestamp": ""
//     }
//   },
//   "gallery": {
//     "id": "",
//     "tag": "",
//     "type": "gallery",
//     "class": "",
//     "visible": true,
//     "original": true,
//     "properties": {
//       "images": [
//         {
//           "bucket": "",
//           "fileName": "",
//           "filePath": "",
//           "publicUrl": ""
//         }
//       ]
//     }
//   },
//   "rsvp": {
//     "id": "",
//     "tag": "",
//     "type": "rsvp",
//     "class": "",
//     "visible": true,
//     "original": true,
//     "properties": {}
//   }
// }
