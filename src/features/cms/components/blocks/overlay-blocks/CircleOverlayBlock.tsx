import { useEffect, useRef, useState } from 'react';

import {
    BlockBase, CircleOverlayProperties, useBlocks
} from '@/features/cms/context/BlocksContext';

import BlockRenderer from '../BlockRenderer';

export default function CircleOverlayBlock(props: BlockBase<CircleOverlayProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  const { parentData } = useBlocks()
  const [isZoomed, setIsZoomed] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [isZoomed]);

  // Unlock scroll when zoom animation finishes
  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'transform' && isZoomed) {
      document.body.style.overflow = ''; // unlock scroll
      setOverlayVisible(false)
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(true);

    if (parentData?.music_url) {
      const audio = new Audio(parentData?.music_url);
      audio.play();
    }
  };

  if (!overlayVisible) return null

  return (
    <div
      ref={overlayRef}
      className={`circle-overlay-block ${isZoomed ? 'zoomed' : ''}`}
      onTransitionEnd={onTransitionEnd}
      onClick={handleButtonClick}
    >
      <BlockRenderer pageStyles={props.pageStyles} blocks={props.properties.blocks} />
    </div>
  );
}
