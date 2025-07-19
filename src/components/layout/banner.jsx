import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade"; // Thêm hiệu ứng fade
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import hinh1 from "../../assets/img/cdn.jpg";
import hinh2 from "../../assets/img/duoi-day-ho.jpg";
import hinh3 from "../../assets/img/mua-lua.jpg";
import hinh4 from "../../assets/img/doraemon-movie-44.jpg";
import hinh5 from "../../assets/img/cdn.jpg";
import hinh6 from "../../assets/img/duoi-day-ho.jpg";
import hinh7 from "../../assets/img/mua-lua.jpg";

const banner = () => {
  return (
    <div className="w-full bg-gray-100 py-4 md:py-6">
      <div className="max-w-screen-xl w-full mx-auto px-2 sm:px-4 lg:px-8">
        <Swiper
          navigation={true}
          effect="fade"
          modules={[Navigation, Autoplay, EffectFade]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          slidesPerView={1}
          spaceBetween={0}
          className="rounded-xl overflow-hidden shadow-2xl"
        >
          {[hinh1, hinh2, hinh3, hinh4, hinh5, hinh6, hinh7].map(
            (hinh, index) => (
              <SwiperSlide key={index}>
                <div className="w-full aspect-[16/16] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[16/7] xl:aspect-[16/6] 2xl:aspect-[16/5]">
                  <img
                    src={hinh}
                    alt={`slide-${index}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default banner;
