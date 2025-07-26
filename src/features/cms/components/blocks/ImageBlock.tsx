import { BlockBase, ImageProperties } from '../../context/BlocksContext';

export default function ImageBlock(
  props: BlockBase<ImageProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }
) {
  return (
    <img
      id={props.id}
      className={props.pageStyles[props.class]}
      data-type={props.type}
      src={props.properties.file.publicUrl || undefined}
      alt="Image"
      loading="eager"
    />
  );
}
