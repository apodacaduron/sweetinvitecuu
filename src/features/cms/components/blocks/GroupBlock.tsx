import BlockRenderer, { BlockProps } from './BlockRenderer';

export default function GroupBlock(props: BlockProps<any>) {
  return (
    <div id={props.id} className={props.pageStyles[props.class]}>
      <BlockRenderer pageStyles={props.pageStyles} blocks={props.properties.blocks} />
    </div>
  );
}
