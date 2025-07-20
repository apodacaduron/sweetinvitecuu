import { Button } from '@/components/ui/button';

import BlockRenderer, { BlockProps } from './BlockRenderer';

type LinkProperties = {
  content: string
  url: string
  target: string
}

export default function RowBlock(props: BlockProps<LinkProperties>) {
  return (
    <Button asChild>
      <a id={props.id} className={props.pageStyles[props.class]} data-type={props.type} href={props.properties.url} target={props.properties.target ?? '_blank'}>
        {props.properties.content}
      </a>
    </Button>
  );
}
