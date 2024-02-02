"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

type Props = {
  gallary: string[];
};

const SwiperComponent = ({ gallary }: Props) => {
  return (
    <Swiper
      modules={[Navigation]}
      className="w-full"
      spaceBetween={0}
      slidesPerView={1}
      navigation={{enabled:true}}
    >
      {gallary.map((image, i) => (
        <SwiperSlide key={i} className="">
          <div className="aspect-video w-full relative">
            <Image src={image} alt="image" fill className="object-cover" />
          </div>
        </SwiperSlide>
      ))}

      {/* ...more slides */}
    </Swiper>
  );
};

export default SwiperComponent;
