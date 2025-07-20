import { BlockProps } from './BlockRenderer';

export default function ItineraryBlock(props: BlockProps<any>) {
  return (
    <div id={props.id} className={props.pageStyles[props.class]} data-type={props.type}>
      Itinerary
    </div>
  );
}
