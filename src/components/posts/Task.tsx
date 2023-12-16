import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
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
  const [editIndex, setEditIndex] = useState<number | null>(null);
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
        // Update the task count correctly
        setTaskCount(tasksData.content.length);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTasks();
    };

    fetchData();
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
  const handleRemoveTask = async (index: number) => {
    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);

    try {
      const q = query(collection(db, "tasks"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
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
      }

      setTaskList(updatedTaskList);
      setTaskCount(updatedTaskList.length);
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the modal, close it
        setIsModalOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
                <IoIosRemoveCircleOutline
                  onClick={() => handleRemoveTask(index)}
                />
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
            <div className="modal" ref={modalRef}>
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
