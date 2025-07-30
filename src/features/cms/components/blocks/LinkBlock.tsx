import { Button } from '@/components/ui/button';

import { BlockBase, LinkProperties, resolveClassNames } from '../../context/BlocksContext';

export default function LinkBlock(props: BlockBase<LinkProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  return (
    <Button asChild>
      <a id={props.id} data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style} data-type={props.type} href={props.properties.url} target={props.properties.target ?? '_blank'}>
        {props.properties.content}
      </a>
    </Button>
  );
}
