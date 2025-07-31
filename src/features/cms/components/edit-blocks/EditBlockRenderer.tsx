"use client";

import { Block } from '../../context/BlocksContext';
import CountdownEditBlock from './CountdownEditBlock';
import ElegantTitleOverlayEditBlock from './ElegantTitleOverlayEditBlock';
import GalleryEditBlock from './GalleryEditBlock';
import GroupEditBlock from './GroupEditBlock';
import ImageEditBlock from './ImageEditBlock';
import LinkEditBlock from './LinkEditBlock';
import RowEditBlock from './RowEditBlock';
import RsvpEditBlock from './RsvpEditBlock';
import TextEditBlock from './TextEditBlock';
import TextQueryEditBlock from './TextQueryEditBlock';
import TimelineEditBlock from './TimelineEditBlock';

type Props = {
  blocks: Block[];
};

export default function EditBlockRenderer(props: Props) {
  return (
    <>
      {props.blocks?.map((block, idx) => {
        switch (block?.type) {
          case "group":
            return <GroupEditBlock key={idx} {...block} />;
          case "image":
            return <ImageEditBlock key={idx} {...block} />;
          case "timeline":
            return <TimelineEditBlock key={idx} {...block} />;
          case "elegant-title":
            return <ElegantTitleOverlayEditBlock key={idx} {...block} />;
          case "text":
            return <TextEditBlock key={idx} {...block} />;
          case "text-query":
            return <TextQueryEditBlock key={idx} {...block} />;
          case "link":
            return <LinkEditBlock key={idx} {...block} />;
          case "gallery":
            return <GalleryEditBlock key={idx} {...block} />;
          case "rsvp":
            return <RsvpEditBlock key={idx} {...block} />;
          case "row":
            return <RowEditBlock key={idx} {...block} />;
          case "countdown":
            return <CountdownEditBlock key={idx} {...block} />;
          default:
            return (
              <i key={idx}>
                Edit block <b>{block?.type}</b> not found please contact us.
              </i>
            );
        }
      })}
    </>
  );
}
