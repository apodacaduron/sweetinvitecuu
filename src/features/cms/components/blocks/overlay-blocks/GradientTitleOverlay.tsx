import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    BlockBase, GradientTitleOverlayProperties, resolveClassNames, useBlocks
} from '@/features/cms/context/BlocksContext';

export default function GradientTitleOverlayBlock(props: BlockBase<GradientTitleOverlayProperties> & {
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
      <h1>{props.properties.content}</h1>

      <Button variant='outline'>Abrir invitación</Button>
    </div>
  );
}
