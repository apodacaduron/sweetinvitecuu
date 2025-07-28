"use client";

import { Block } from '../../context/BlocksContext';
import CountdownBlock from './CountdownBlock';
import GalleryBlock from './GalleryBlock';
import GroupBlock from './GroupBlock';
import ImageBlock from './ImageBlock';
import LinkBlock from './LinkBlock';
import CircleOverlayBlock from './overlay-blocks/CircleOverlayBlock';
import RowBlock from './RowBlock';
import RsvpBlock from './RsvpBlock';
import TextBlock from './TextBlock';
import TextQueryBlock from './TextQueryBlock';
import TimelineBlock from './TimelineBlock';

type Props = {
  blocks: Block[];
  pageStyles: {
    readonly [key: string]: string;
  };
};

export default function BlockRenderer(props: Props) {
  return (
    <>
      {props.blocks?.map((block, idx) => {
        if (!block.visible) return null;

        switch (block?.type) {
          case "group":
            return <GroupBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "image":
            return <ImageBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "timeline":
            return <TimelineBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "text":
            return <TextBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "text-query":
            return <TextQueryBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "gallery":
            return <GalleryBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "rsvp":
            return <RsvpBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "row":
            return <RowBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "link":
            return <LinkBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "circle-overlay":
            return <CircleOverlayBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          case "countdown":
            return <CountdownBlock key={idx} {...block} pageStyles={props.pageStyles} />;
          default:
            return (
              <i key={idx}>
                Block not found please contact us.
              </i>
            );
        }
      })}
    </>
  );
}
