import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import PromotionCard from "../../components/ui/PromotionCard";
import km from "../../assets/new/km.jpg";
import { useGetUserPromotionsUS } from "../../api/homePage/queries";

function PromotionSection() {
  const { data, isLoading, isError } = useGetUserPromotionsUS();
  const promotions = Array.isArray(data?.data) ? data.data : [];

  return (
    <section className="max-w-screen-xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold mb-6 border-l-4 border-orange-500 pl-3">
        KHUYẾN MÃI
      </h2>

      {isLoading ? (
        <div className="text-center text-blue-600 font-semibold py-8">
          Đang tải khuyến mãi...
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 font-semibold py-8">
          Không thể tải khuyến mãi!
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center text-gray-500 font-semibold py-8">
          Hiện chưa có khuyến mãi nào.
        </div>
      ) : (
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
          {promotions.map((promo, index) => (
            <SwiperSlide key={promo.promotion_id || index}>
              <PromotionCard
                id={promo.promotion_id}
                title={promo.name}
                image={promo.image || km} // Nếu có trường ảnh thì thay promo.image
                description={promo.description}
                discount={
                  promo.type === "PERCENT_DISCOUNT"
                    ? `${parseFloat(promo.discount_value)}%`
                    : `${parseInt(promo.discount_value).toLocaleString()}đ`
                }
                time={`${new Date(
                  promo.start_date
                ).toLocaleDateString()} - ${new Date(
                  promo.end_date
                ).toLocaleDateString()}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default PromotionSection;
