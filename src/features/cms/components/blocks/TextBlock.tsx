import { BlockProps } from './BlockRenderer';

type TextProperties = {
  content: string
}

export default function TextBlock(props: BlockProps<TextProperties>) {
  return (
    <div className={props.pageStyles[props.class]}>
      {props.properties.content}
    </div>
  );
}
