import { BlockBase, GroupProperties } from '../../context/BlocksContext';
import BlockRenderer from './BlockRenderer';

export default function GroupBlock(props: BlockBase<GroupProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  return (
    <div id={props.id} className={props.pageStyles[props.class]} data-type={props.type}>
      <BlockRenderer pageStyles={props.pageStyles} blocks={props.properties.blocks} />
    </div>
  );
}
