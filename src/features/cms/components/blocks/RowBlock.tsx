import { BlockBase, resolveClassNames, RowProperties } from '../../context/BlocksContext';
import BlockRenderer from './BlockRenderer';

export default function RowBlock(props: BlockBase<RowProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  return (
    <div id={props.id} data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style} data-type={props.type}>
      <BlockRenderer pageStyles={props.pageStyles} blocks={props.properties.blocks} />
    </div>
  );
}
