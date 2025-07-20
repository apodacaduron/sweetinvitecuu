import { BlockProps } from './BlockRenderer';

type TextProperties = {
  content: string
}

export default function TextBlock(props: BlockProps<TextProperties>) {
  return (
    <div id={props.id} className={props.pageStyles[props.class]} data-type={props.type}>
      {props.properties.content}
    </div>
  );
}
