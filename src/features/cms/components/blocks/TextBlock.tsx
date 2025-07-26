import { BlockBase, TextProperties } from '../../context/BlocksContext';

export default function TextBlock(
  props: BlockBase<TextProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }
) {
  return (
    <div
      id={props.id}
      className={props.pageStyles[props.class]}
      data-type={props.type}
    >
      {props.properties.content}
    </div>
  );
}
