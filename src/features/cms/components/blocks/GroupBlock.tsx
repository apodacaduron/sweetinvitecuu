import { BlockBase, GroupProperties, resolveClassNames } from '../../context/BlocksContext';
import BlockRenderer from './BlockRenderer';

export default function GroupBlock(props: BlockBase<GroupProperties> & {
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
