'use client';

import { useSearchParams } from 'next/navigation';

import { BlockBase, resolveClassNames, TextQueryProperties } from '../../context/BlocksContext';

export default function TextQueryBlock(
  props: BlockBase<TextQueryProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }
) {
  const searchParams = useSearchParams();

  // Use query param if available, else fallback to content
  const queryKey = props.properties.query;
  const valueFromQuery = queryKey ? searchParams.get(queryKey) : null;
  const content = valueFromQuery ?? props.properties.content;

  return (
    <div
      id={props.id}
      data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)}
      style={props.style}
      data-type={props.type}
    >
      {content}
    </div>
  );
}
