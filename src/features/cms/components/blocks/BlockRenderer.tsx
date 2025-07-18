"use client";

import { CSSProperties } from 'react';

import GalleryBlock from './GalleryBlock';
import GroupBlock from './GroupBlock';
import ImageBlock from './ImageBlock';
import ItineraryBlock from './ItineraryBlock';
import RowBlock from './RowBlock';
import RsvpBlock from './RsvpBlock';
import TextBlock from './TextBlock';

type Props = {
  blocks: any;
  pageStyles: {
    readonly [key: string]: string;
  };
};

export type BlockProps<T> = {
  properties: T;
  id?: string;
  class: string;
  style?: CSSProperties | undefined;
  pageStyles: {
    readonly [key: string]: string;
  };
};

export default function BlockRenderer(props: Props) {
  return (
    <>
      {props.blocks?.map((block: any, idx: number) => {
        const nextProps = {
          pageStyles: props.pageStyles,
          ...block,
        };

        if (!block.visible) return null

        switch (block?.type) {
          case "group":
            return <GroupBlock key={idx} {...nextProps} />;
          case "image":
            return <ImageBlock key={idx} {...nextProps} />;
          case "itinerary":
            return (
              <ItineraryBlock key={idx} {...nextProps} />
            );
          case "text":
            return (
              <TextBlock key={idx} {...nextProps} />
            );
          case "gallery":
            return (
              <GalleryBlock key={idx} {...nextProps} />
            );
          case "rsvp":
            return (
              <RsvpBlock key={idx} {...nextProps} />
            );
          case "row":
            return (
              <RowBlock key={idx} {...nextProps} />
            );
          default:
            return <i key={idx}>Block <b>{block?.type}</b> not found please contact us.</i>;
        }
      })}
    </>
  );
}
