import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

interface ConfidenceProps {
  affirmations: string[];
}

const Confidence: React.FC<ConfidenceProps> = ({ affirmations }) => {
  return (
    <div className="confidence">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper: any) => console.log(swiper)}
      >
        <h2>부에 대한 확언</h2>
        {affirmations.map((affirmation, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <p>{affirmation}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Confidence;
