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
    <div className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      <Swiper
        navigation={true}
        effect="fade" // Thêm hiệu ứng fade
        modules={[Navigation, Autoplay, EffectFade]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        slidesPerView={1}
        spaceBetween={0}
        className="rounded-lg overflow-hidden shadow-lg"
      >
        {[hinh1, hinh2, hinh3, hinh4, hinh5, hinh6, hinh7].map(
          (hinh, index) => (
            <SwiperSlide key={index}>
              <img
                src={hinh}
                alt={`slide-${index}`}
                className="object-cover w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]"
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

export default banner;
