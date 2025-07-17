import { BlockProps } from './BlockRenderer';

export default function LocationBlock(props: BlockProps<any>) {
  return (
    <div className={props.pageStyles['location-block']}>
      Location
    </div>
  );
}
