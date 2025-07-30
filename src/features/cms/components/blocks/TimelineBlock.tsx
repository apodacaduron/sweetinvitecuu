import { Separator } from '@/components/ui/separator';

import { BlockBase, resolveClassNames, TimelineProperties } from '../../context/BlocksContext';

export default function TimelineBlock(props: BlockBase<TimelineProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  return (
    <div
      id={props.id}
      data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style}
      data-type={props.type}
    >
      {props.properties.items.map((item, index) => {
        return (
          <div
            key={index}
            className={`flex justify-center items-center ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`w-full ${
                index % 2 === 0 ? "text-right" : "text-left"
              }`}
            >
              <div>{item.content}</div>
            </div>
            <div className="w-40 h-24 flex justify-center relative">
              <Separator orientation="vertical" className="bg-primary" />
            </div>
            <div
              className={`w-full flex ${
                index % 2 === 0
                  ? "text-left justify-start"
                  : "text-right justify-end"
              }`}
            >
              <img
                className={`${props.pageStyles[props.class]}-img`}
                src={item.image.publicUrl}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
