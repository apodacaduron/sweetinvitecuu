import { useEffect, useState } from 'react';

import { BlockBase, CountdownProperties, resolveClassNames } from '../../context/BlocksContext';

export default function CountdownBlock(  props: BlockBase<CountdownProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date().getTime();
    const target = new Date(props.properties.timestamp).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)) || 0,
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24) || 0,
      minutes: Math.floor((difference / (1000 * 60)) % 60) || 0,
      seconds: Math.floor((difference / 1000) % 60) || 0,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [props.properties.timestamp]);

  return (
    <div id={props.id} data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style} data-type={props.type}>
      <div>{timeLeft?.days || 0}<br /><span>días</span></div>
      <div>{timeLeft?.hours || 0}<br /><span>horas</span></div>
      <div>{timeLeft?.minutes || 0}<br /><span>minutos</span></div>
      <div>{timeLeft?.seconds || 0}<br /><span>segundos</span></div>
    </div>
  );
}
