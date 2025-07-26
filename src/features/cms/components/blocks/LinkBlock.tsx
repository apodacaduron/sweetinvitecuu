import { Button } from '@/components/ui/button';

import { BlockBase, LinkProperties } from '../../context/BlocksContext';

export default function LinkBlock(props: BlockBase<LinkProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  return (
    <Button asChild>
      <a id={props.id} className={props.pageStyles[props.class]} data-type={props.type} href={props.properties.url} target={props.properties.target ?? '_blank'}>
        {props.properties.content}
      </a>
    </Button>
  );
}
