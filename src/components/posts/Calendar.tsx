import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { format, addDays, subDays } from "date-fns";

const Calendar = () => {
  const currentDate = new Date();
  const daysToShow = 500;
  const daysInPast = 500; // 변경 가능: 표시할 과거 날짜 수

  const generateCalendarData = () => {
    const calendarData = [];

    // 과거 날짜 추가
    for (let i = daysInPast; i > 0; i--) {
      const date = subDays(currentDate, i);
      const formattedDate = format(date, "dd");
      const dayOfWeek = format(date, "EE");
      calendarData.push({ formattedDate, dayOfWeek });
    }

    // 현재 날짜부터 미래 날짜 추가
    for (let i = 0; i < daysToShow; i++) {
      const date = addDays(currentDate, i);
      const formattedDate = format(date, "dd");
      const dayOfWeek = format(date, "EE");
      calendarData.push({ formattedDate, dayOfWeek });
    }

    return calendarData;
  };

  const calendarData = generateCalendarData();
  const initialSlide = daysInPast; // 초기 슬라이드 인덱스를 설정

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={5}
      navigation
      pagination={{ clickable: true }}
      initialSlide={initialSlide - 2}
      scrollbar={{ draggable: true }}
      className="custom-swiper"
    >
      {calendarData.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              padding: "10px",
              textAlign: "center",
              fontSize: "0.75rem",
              width: "40px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <div>{item.formattedDate}</div>
            <div>{item.dayOfWeek}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Calendar;
