import React from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import HomePage from "pages/home";
import TodoPage from "pages/todo";
import MemoryPage from "pages/memory";
import ProfilePage from "pages/profile";
import StatementPage from "pages/statement";
import Wealth from "components/statement/Wealth";
import Confidence from "components/statement/Confidence";
import Self from "components/statement/Self";
import RoughTime from "components/statement/RoughTime";
import DreamPage from "pages/dream";
import GoalPage from "pages/goals";
import SignupPage from "pages/signup";
import LoginPage from "pages/login";

// Sample Affirmations Data
const affirmations = {
  selfAffirmations: [
    "나는 강하고 자신감 있습니다.",
    "내 안에는 무한한 가능성이 있습니다.",
    "나는 노력하는 모습이 아름답다고 믿습니다.",
    // ... more self affirmations
  ],
  wealthAffirmations: [
    "나는 성공을 위해 끊임없이 노력하고 있다.",
    "내 노력과 헌신이 성공으로 나아가는 길이다.",
    "성공은 내 자신에 대한 믿음과 함께 시작된다.",
    "나는 어떤 일이든 성공할 능력을 갖추고 있다.",
    "성공은 내가 정한 목표를 달성하는 과정이다.",
    "나는 어려움을 극복하며 성공으로 나아가고 있다.",
    "내가 원하는 삶을 위해 노력하면 성공은 뒤따를 것이다.",
    "성공은 지속적인 학습과 발전의 결과이다.",
    "나는 성공적인 선택을 할 자신이 있다.",
    "내 내일은 오늘보다 더 나은 성과를 가져다 줄 것이다.",
  ],
  confidenceAffirmations: [
    "나는 자신감 넘치는 사람입니다.",
    "자신감을 가지면 어떤 어려움도 이길 수 있습니다.",
    "내 안에 자신감의 근원이 있습니다.",
    // ... more confidence affirmations
  ],
  roughtimeAffirmations: [
    "나는 성공을 위해 노력하고 있습니다.",
    "성공은 내 노력에 대한 보상입니다.",
    "나는 어떤 일이든 성공할 자격이 있습니다.",
    // ... more success affirmations
  ],
};

interface RouterProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterProps) {
  const param = useParams();
  console.log(param);
  return (
    <>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/statement" element={<StatementPage />} />
            <Route
              path="/statement/wealth"
              element={
                <Wealth affirmations={affirmations.wealthAffirmations} />
              }
            />
            <Route
              path="/statement/confidence"
              element={
                <Confidence
                  affirmations={affirmations.confidenceAffirmations}
                />
              }
            />
            <Route
              path="/statement/self"
              element={<Self affirmations={affirmations.selfAffirmations} />}
            />
            <Route
              path="/statement/rough"
              element={
                <RoughTime affirmations={affirmations.roughtimeAffirmations} />
              }
            />
            <Route path="/dream" element={<DreamPage />} />
            <Route path="/goal" element={<GoalPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<LoginPage />} />
          </>
        )}
      </Routes>
    </>
  );
}
