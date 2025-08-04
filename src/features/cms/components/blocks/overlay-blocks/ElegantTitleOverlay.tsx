import { useEffect, useState } from 'react';

import {
    BlockBase, ElegantTitleOverlayProperties, resolveClassNames, useBlocks
} from '@/features/cms/context/BlocksContext';

export default function ElegantTitleOverlayBlock(props: BlockBase<ElegantTitleOverlayProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  const { parentData } = useBlocks()
  const [hidden, setHidden] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [hidden]);

  // Unlock scroll when zoom animation finishes
  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'opacity' && hidden) {
      document.body.style.overflow = ''; // unlock scroll
      setOverlayVisible(false)
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHidden(true);

    if (parentData?.music_url) {
      const audio = new Audio(parentData?.music_url);
      audio.play();
    }
  };

  if (!overlayVisible) return null

  return (
    <div
      data-aos={props?.animation} className={resolveClassNames(`${props.class} elegant-title-overlay ${hidden && 'elegant-title-overlay--hidden'}`, props.pageStyles)}
      onTransitionEnd={onTransitionEnd}
      onClick={handleButtonClick}
    >
      <img src="/assets/81cd8490-7ca7-4a46-b0fe-4e3b710f09dd.svg" className='w-full max-w-3xs' />
      <h1>{props.properties.content}</h1>
      <img src="/assets/0c09f3d3-2254-4b5a-83f6-4af202c30310.svg" className='w-full max-w-3xs' />
    </div>
  );
}
