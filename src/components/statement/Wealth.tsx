import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

interface WealthProps {
  affirmations: string[];
}

const Wealth: React.FC<WealthProps> = ({ affirmations }) => {
  const timeoutRef = useRef<number | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Function to speak the given text
  const speakText = (text: string) => {
    const voices = window.speechSynthesis.getVoices();
    // Find an English voice, or use the first available voice if none is found
    const koreanVoice =
      voices.find((voice) => voice.lang.startsWith("ko")) || voices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = koreanVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Speak all affirmations sequentially
  const speakAllAffirmations = () => {
    setAudioPlaying(true);

    affirmations.forEach((affirmation, index) => {
      // Delay each affirmation by 2 seconds (adjust as needed)
      timeoutRef.current = window.setTimeout(
        () => speakText(affirmation),
        index * 2000
      );
    });
  };

  // Function to toggle audio playback
  const toggleAudio = () => {
    if (audioPlaying) {
      // If audio is playing, pause it
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      setAudioPlaying(false);
    } else {
      // If audio is paused, start it
      speakAllAffirmations();
    }
  };

  useEffect(() => {
    // Speak the first affirmation when the component mounts
    if (affirmations.length > 0) {
      speakText(affirmations[0]);
    }

    // Clear the timeout when the component is unmounted
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [affirmations]);

  return (
    <div className="Wealth">
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
      <button onClick={toggleAudio}>
        {audioPlaying ? "Pause Audio" : "Start Audio"}
      </button>
    </div>
  );
};

export default Wealth;
