"use client";

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Image from 'next/image'; // Importa el componente Image de Next.js

const carouselData = [
  {
    image: '/slider1.jpg',
    alt: 'Slider 1',
    title: 'Título del Slider 1',
    description: 'Descripción del Slider 1',
  },
  {
    image: '/slider2.jpg',
    alt: 'Slider 2',
    title: 'Título del Slider 2',
    description: 'Descripción del Slider 2',
  },
  {
    image: '/slider3.jpg',
    alt: 'Slider 3',
    title: 'Título del Slider 3',
    description: 'Descripción del Slider 3',
  },
];

const Carousel = () => {
  return (
    <div className="w-full">
      <Swiper
       modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      
      >
        {carouselData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gray-900 w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center relative">
              <Image
                src={item.image}
                alt={item.alt}
                width={1920}
                height={1080}
                
              />
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
