import { BlockProps } from './BlockRenderer';

export default function ScheduleBlock(props: BlockProps<any>) {
  return (
    <div className={props.pageStyles['schedule-block']}>
      Schedule
    </div>
  );
}
