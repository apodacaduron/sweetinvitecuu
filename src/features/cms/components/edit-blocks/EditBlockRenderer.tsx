"use client";

import { CSSProperties } from 'react';

import GalleryEditBlock from './GalleryEditBlock';
import GroupEditBlock from './GroupEditBlock';
import ImageEditBlock from './ImageEditBlock';
import ItineraryEditBlock from './ItineraryEditBlock';
import RowEditBlock from './RowEditBlock';
import RsvpEditBlock from './RsvpEditBlock';
import TextEditBlock from './TextEditBlock';

type Props = {
  blocks: any;
};

export type EditBlockProps<T> = {
  properties: T;
  id: string;
  class: string;
  visible: boolean;
  style?: CSSProperties | undefined;
};

export default function EditBlockRenderer(props: Props) {
  return (
    <>
      {props.blocks?.map((block: any, idx: number) => {
        const nextProps = {
          ...block,
        };

        switch (block?.type) {
          case "group":
            return <GroupEditBlock key={idx} {...nextProps} />;
          case "image":
            return <ImageEditBlock key={idx} {...nextProps} />;
          case "itinerary":
            return (
              <ItineraryEditBlock key={idx} {...nextProps} />
            );
          case "text":
            return (
              <TextEditBlock key={idx} {...nextProps} />
            );
          case "gallery":
            return (
              <GalleryEditBlock key={idx} {...nextProps} />
            );
          case "rsvp":
            return (
              <RsvpEditBlock key={idx} {...nextProps} />
            );
          case "row":
            return (
              <RowEditBlock key={idx} {...nextProps} />
            );
          default:
            return <i key={idx}>Edit block <b>{block?.type}</b> not found please contact us.</i>;
        }
      })}
    </>
  );
}
