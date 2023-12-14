// Task.tsx
import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";

import { useTask } from "context/TaskContext";
import Header from "components/user/Header";
import Calendar from "./Calendar";

interface TaskProps {}

const Task: React.FC<TaskProps> = () => {
  const { taskCount, setTaskCount } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<string>("");
  const [taskList, setTaskList] = useState<string[]>([]);

  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTaskList([...taskList, newTask]);
      setNewTask("");
      setIsModalOpen(false);
      setTaskCount(taskList.length + 1); // Update taskCount in the context
    }
  };

  return (
    <div>
      {/* <Header taskCount={taskCount} /> */}
      <Calendar />
      <div className="todo">
        <div className="title">Task</div>
        <div className="todo-list">
          {taskList.map((task, index) => (
            <div key={index} className="item">
              <input type="checkbox" name="" id="" />
              <div className="item__content">{task}</div>
              <div className="item__detail">
                <IoIosNotifications />
              </div>
            </div>
          ))}
        </div>
        <div className="plus" onClick={handleModalOpen}>
          {isModalOpen == false ? "+" : ""}
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header"></div>
            <div className="modal-content">
              <input
                type="text"
                placeholder="할 일을 입력하세요"
                value={newTask}
                onChange={handleTaskInputChange}
              />
              <button onClick={handleAddTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
