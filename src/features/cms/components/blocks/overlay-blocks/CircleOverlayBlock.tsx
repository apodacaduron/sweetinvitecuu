import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { BlockProps } from '../BlockRenderer';

export default function CircleOverlayBlock(props: BlockProps<any>) {
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
  };

  if (!overlayVisible) return null

  return (
    <div
      ref={overlayRef}
      className={`circle-overlay-block ${isZoomed ? 'zoomed' : ''}`}
      onTransitionEnd={onTransitionEnd}
      onClick={() => {
        if (!isZoomed) setIsZoomed(true);
      }}
    >
      <Button
        size="lg"
        className={`absolute left-1/2 transform -translate-x-1/2 bottom-30 text-xl p-6 z-10 transition-opacity duration-700 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleButtonClick}
      >
        Abrir invitación
      </Button>
    </div>
  );
}
