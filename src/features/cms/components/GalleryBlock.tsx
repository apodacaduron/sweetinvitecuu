import { BlockProps } from './BlockRenderer';

export type GalleryProperties = {
  title: string
  images: string[]
}

export default function GalleryBlock(props: BlockProps<GalleryProperties>) {
  return (
    <div className={props.pageStyles['gallery-block']}>
      Gallery
    </div>
  );
}
