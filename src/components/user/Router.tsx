import HomePage from "pages/home";
import LoginPage from "pages/login";
import ProfilePage from "pages/profile";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import TodoPage from "pages/todo";
import DreamPage from "pages/dream";
import GoalPage from "pages/goals";
import SignupPage from "pages/signup";
import StatementPage from "pages/statement";
import Wealth from "components/statement/Wealth";
import Confidence from "components/statement/Confidence";
import MemoryPage from "pages/memory";

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
            <Route path="/statement/wealth" element={<Wealth />} />
            <Route path="/statement/confidence" element={<Confidence />} />
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
