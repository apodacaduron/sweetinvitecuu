"use client";

import { BlockRenderer } from '@/features/cms/components';

import pageStyles from './style.module.css';

type Props = {
    blocks: any
}

export default function MinimalMoonTemplate(props: Props) {
  return (
    <div className='max-w-xl mx-auto whitespace-pre-line'>
      <BlockRenderer pageStyles={pageStyles} blocks={props?.blocks} />
    </div>
  );
}
