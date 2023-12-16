import React from "react";
import Task from "components/posts/Task";
import Project from "components/posts/Project";
import Header from "components/user/Header";

const TodoPage: React.FC = () => {
  return (
    <div className="todo-page-container">
      <Task />
      <Project />
    </div>
  );
};

export default TodoPage;
