import { BlockProps } from './BlockRenderer';

export type ImageProperties = {
  file: {
    publicUrl: string;
    filePath: string;
    fileName: string;
    bucket: string;
  };
};

export default function ImageBlock(props: BlockProps<ImageProperties>) {
  return (
    <img
      id={props.id}
      className={props.pageStyles[props.class]}
      src={props.properties.file.publicUrl || undefined}
      alt="Hero image"
    />
  );
}
