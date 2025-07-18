import { BlockProps } from './BlockRenderer';

export type ImageProperties = {
  image: string;
};

export default function ImageBlock(props: BlockProps<ImageProperties>) {
  return (
    <img
      id={props.id}
      className={props.pageStyles[props.class]}
      src={props.properties.image}
      alt="Hero image"
    />
  );
}
