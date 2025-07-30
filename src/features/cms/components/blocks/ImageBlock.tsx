import { BlockBase, ImageProperties, resolveClassNames } from '../../context/BlocksContext';

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
      data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style}
      data-type={props.type}
      src={props.properties.file.publicUrl || undefined}
      alt="Image"
      loading="eager"
    />
  );
}
