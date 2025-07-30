'use client'; // If you're using Next.js App Router

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { BlockBase, GalleryProperties, resolveClassNames } from '../../context/BlocksContext';

export default function GalleryBlock(props: BlockBase<GalleryProperties> & {
    pageStyles: {
      readonly [key: string]: string;
    };
  }) {
  return (
      <Swiper
        id={props.id} data-aos={props?.animation} className={resolveClassNames(props.class, props.pageStyles)} style={props.style} data-type={props.type}
        modules={[Navigation, Pagination]}
        loop
        pagination={{ clickable: true }}
        navigation
      >
        {props.properties.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image.publicUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" loading="eager" />
          </SwiperSlide>
        ))}
      </Swiper>
  );
}
