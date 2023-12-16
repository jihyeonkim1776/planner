import React, { useContext, useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { useTask } from "context/TaskContext";
import Calendar from "./Calendar";
import AuthContext from "context/AuthContext";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "firebaseApp";

interface TaskProps {}

const Task: React.FC<TaskProps> = () => {
  const { taskCount, setTaskCount } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<string>("");
  const [taskList, setTaskList] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, "tasks"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        const tasksData = querySnapshot.docs[0].data();
        setTaskList(tasksData.content);
        setTaskCount(tasksData.content.length);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTask.trim() !== "") {
      const updatedTaskList = [...taskList, newTask];

      try {
        const q = query(collection(db, "tasks"), where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
          // If the user has an existing document, update it
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            content: updatedTaskList,
            updatedAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });
        } else {
          // If the user doesn't have an existing document, add a new one
          const docRef = await addDoc(collection(db, "tasks"), {
            content: updatedTaskList,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });

          console.log("Task added to Firestore with ID:", docRef.id);
        }

        setTaskList(updatedTaskList);
        setNewTask("");
        setIsModalOpen(false);
        setTaskCount(updatedTaskList.length - 1 + 1);
      } catch (error) {
        console.error("Error adding/updating task:", error);
      }
    }
  };

  return (
    <div>
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
          {isModalOpen === false ? "+" : ""}
        </div>
      </div>

      {isModalOpen && (
        <form className="post-form" onSubmit={handleAddTask}>
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
                <button type="submit">Add Task</button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Task;
