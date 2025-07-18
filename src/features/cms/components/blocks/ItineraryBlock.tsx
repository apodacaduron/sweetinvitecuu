import { BlockProps } from './BlockRenderer';

export default function ItineraryBlock(props: BlockProps<any>) {
  return (
    <div className={props.pageStyles['itinerary-block']}>
      Itinerary
    </div>
  );
}
