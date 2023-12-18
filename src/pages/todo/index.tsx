import React from "react";
import Header from "components/user/Header";
import Task from "components/posts/taskrevise";

const TodoPage: React.FC = () => {
  return (
    <div className="todo-page-container">
      <Task />
    </div>
  );
};

export default TodoPage;
