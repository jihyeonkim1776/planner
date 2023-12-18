import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import {
  IoIosRemoveCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import AuthContext from "context/AuthContext";
import {
  addDoc,
  collection,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "firebaseApp";
import Calendar from "components/memory/Calendar";
import { format } from "date-fns"; // Fix the import for 'format'

interface TodoProps {}

const Todo: React.FC<TodoProps> = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState<string>("");
  const [todoList, setTodoList] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { user } = useContext(AuthContext);

  //   useEffect(() => {
  //     const loadDiaryContent = async () => {
  //       if (!user || !selectedDate) {
  //         return; // Skip loading if user or selectedDate is undefined
  //       }

  //       try {
  //         const q = query(
  //           collection(db, "todos"),
  //           where("uid", "==", user.uid)
  //           // Remove the date filter to fetch all diaries for the user
  //         );
  //         const querySnapshot = await getDocs(q);

  //         // Process the diaries as needed
  //         const todos = querySnapshot.docs.map((doc) => doc.data());
  //         console.log("User diaries:", todos);

  //         // Find the diary entry for the selected date, if any
  //         const todoForSelectedDate = todos.find(
  //           (todo) => todo.date === format(selectedDate, "yyyy-MM-dd")
  //         );

  //         if (todoForSelectedDate) {
  //           // If a diary entry exists for the selected date, set the content
  //           setTodoList(todoForSelectedDate.content);
  //         } else {
  //           // If no entry exists, clear the content
  //           setTodoList([]);
  //         }
  //       } catch (error) {
  //         console.error("Error loading diaries:", error);
  //       }
  //     };

  //     loadDiaryContent();
  //   }, [selectedDate, user]);
  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const fetchTodos = async () => {
    if (user) {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        const q = query(
          collection(db, "todos"),
          where("uid", "==", user.uid),
          where("date", "==", formattedDate)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const todosData = querySnapshot.docs[0].data();
          setTodoList(todosData.content || []); // Ensure content is an array
        } else {
          setTodoList([]); // No tasks for the selected date
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [selectedDate, user]);

  const handleTodoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTodo.trim() !== "") {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const updatedTodoList = [...todoList, newTodo]; // Ensure each item is a string

      try {
        const q = query(
          collection(db, "todos"),
          where("uid", "==", user?.uid),
          where("date", "==", formattedDate)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            content: updatedTodoList,
            updatedAt: new Date().toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });
        } else {
          const docRef = await addDoc(collection(db, "todos"), {
            content: updatedTodoList,
            date: formattedDate,
            createdAt: new Date().toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });

          console.log("todo added to Firestore with ID:", docRef.id);
        }

        setNewTodo("");
        setIsModalOpen(false);
        // Fetch the updated tasks immediately after adding a new task
        await fetchTodos();
      } catch (error) {
        console.error("Error adding/updating todo:", error);
      }
    }
  };

  const handleCompleteEdit = async () => {
    if (editIndex !== null && newTodo.trim() !== "") {
      const updatedTodoList = [...todoList];
      updatedTodoList[editIndex] = newTodo;

      try {
        const q = query(collection(db, "todos"), where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            content: updatedTodoList,
            updatedAt: new Date().toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });
        }

        setTodoList(updatedTodoList);
        setNewTodo("");
        setEditIndex(null);
        // Fetch the updated tasks immediately after completing the edit
        await fetchTodos();
      } catch (error) {
        console.error("Error completing edit:", error);
      }
    }
  };

  const handleEditTask = (index: number) => {
    setNewTodo(todoList[index]);
    setEditIndex(index);
  };
  const handleRemoveTask = async (index: number) => {
    const updatedTodoList = [...todoList];
    updatedTodoList.splice(index, 1);

    try {
      const q = query(collection(db, "todos"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          content: updatedTodoList,

          updatedAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
      }

      setTodoList(updatedTodoList);
      setEditIndex(null);
    } catch (error) {
      console.error("Error removing todo task:", error);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <div className="todo">
        <div className="title">Todo Goals</div>
        <div className="todo-list">
          {todoList.map((todo, index) => (
            <div key={index} className="item">
              <input type="checkbox" name="" id="" />
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                  <IoMdCheckmarkCircleOutline onClick={handleCompleteEdit} />
                </>
              ) : (
                <div
                  className="item__content"
                  onClick={() => handleEditTask(index)}
                >
                  {todo}
                </div>
              )}
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
        <form className="post-form" onSubmit={handleAddTodo}>
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <div className="modal-header"></div>
              <div className="modal-content">
                <input
                  type="text"
                  placeholder="Enter your task"
                  value={newTodo}
                  onChange={handleTodoInputChange}
                />
                <button type="submit">Add</button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Todo;
