import React from "react";

// 확언 명언 데이터
interface Affirmations {
  selfAffirmations: string[];
  familyAffirmations: string[];
  confidenceAffirmations: string[];
  successAffirmations: string[];
}
const affirmations: Affirmations = {
  selfAffirmations: [
    "나는 강하고 자신감 있습니다.",
    "내 안에는 무한한 가능성이 있습니다.",
    "나는 노력하는 모습이 아름답다고 믿습니다.",
    // ... 더 많은 확언 명언 추가
  ],
  familyAffirmations: [
    "가족은 내 인생의 큰 힘입니다.",
    "가족과 함께 보내는 시간은 소중하고 특별합니다.",
    "가족과의 사랑은 나를 더 강하게 만듭니다.",
    // ... 더 많은 확언 명언 추가
  ],
  confidenceAffirmations: [
    "나는 자신감 넘치는 사람입니다.",
    "자신감을 가지면 어떤 어려움도 이길 수 있습니다.",
    "내 안에 자신감의 근원이 있습니다.",
    // ... 더 많은 확언 명언 추가
  ],
  successAffirmations: [
    "나는 성공을 위해 노력하고 있습니다.",
    "성공은 내 노력에 대한 보상입니다.",
    "나는 어떤 일이든 성공할 자격이 있습니다.",
    // ... 더 많은 확언 명언 추가
  ],
};
const getRandomAffirmations = (section: keyof Affirmations) => {
  const sectionAffirmations = affirmations[section];
  const randomAffirmations = [];

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * sectionAffirmations.length);
    randomAffirmations.push(sectionAffirmations[randomIndex]);
  }

  return randomAffirmations;
};
const Wealth = () => {
  return (
    <div>
      <h2>자기확언</h2>
      {getRandomAffirmations("selfAffirmations").map((affirmation, index) => (
        <p key={index}>{affirmation}</p>
      ))}
    </div>
  );
};

export default Wealth;
