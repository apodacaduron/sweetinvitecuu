import { BlockBase, resolveClassNames, TextProperties } from '../../context/BlocksContext';

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
      data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style}
      data-type={props.type}
    >
      {props.properties.content}
    </div>
  );
}
