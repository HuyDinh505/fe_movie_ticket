import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import PromotionCard from "../../components/ui/PromotionCard";
import km from "../../assets/new/km.jpg";

const dummyPromotions = Array(18).fill({
  image: km,
  title: "U22 Vui Vẻ - Bắp Nước Siêu Hạt Dẻ",
});

function PromotionSection() {
  return (
    <section className="max-w-screen-xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold mb-6 border-l-4 border-orange-500 pl-3">
        KHUYẾN MÃI
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 6,
          },
        }}
        className="w-full"
      >
        {dummyPromotions.map((promo, index) => (
          <SwiperSlide key={index}>
            <PromotionCard {...promo} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default PromotionSection;
