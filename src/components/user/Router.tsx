
import HomePage from "pages/home";
import LoginPage from "pages/login";
import ProfilePage from "pages/profile";
import { Route, Routes, Navigate } from "react-router-dom";
import TodoPage from "pages/todo";
import DreamPage from "pages/dream";
import GoalPage from "pages/goals";



export default function Router() {
  return (
    <Routes>
      
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dream" element={<DreamPage />} />
          <Route path="/goal" element={<GoalPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </>

    </Routes>
  );
}