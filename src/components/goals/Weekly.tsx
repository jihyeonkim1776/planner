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

interface WeeklyProps {}

const Weekly: React.FC<WeeklyProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeekly, setNewWeekly] = useState<string>("");
  const [WeeklyList, setWeeklyList] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track the index of the item being edited
  const { user } = useContext(AuthContext);

  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const fetchWeeklys = async () => {
    if (user) {
      try {
        const q = query(
          collection(db, "Weeklys"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const WeeklysData = querySnapshot.docs[0].data();
          setWeeklyList(WeeklysData.content);
        }
      } catch (error) {
        console.error("Error fetching Weeklys:", error);
      }
    }
  };

  useEffect(() => {
    fetchWeeklys();
  }, []);

  const handleWeeklyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWeekly(e.target.value);
  };

  const handleAddWeekly = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newWeekly.trim() !== "") {
      const updatedWeeklyList = [...WeeklyList, newWeekly];

      try {
        // Check if the user has an existing document
        const q = query(
          collection(db, "Weeklys"),
          where("uid", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          // If the user has an existing document, update it
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, {
            content: updatedWeeklyList,
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
          const docRef = await addDoc(collection(db, "Weeklys"), {
            content: updatedWeeklyList,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });

          console.log("Weekly added to Firestore with ID:", docRef.id);
        }

        setWeeklyList(updatedWeeklyList);
        setNewWeekly("");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error adding/updating Weekly:", error);
      }
    }
  };

  const handleEditTask = (index: number) => {
    setNewWeekly(WeeklyList[index]); // Set the text to be edited
    setEditIndex(index); // Set the index of the item being edited
  };

  const handleCompleteEdit = async () => {
    if (editIndex !== null && newWeekly.trim() !== "") {
      const updatedWeeklyList = [...WeeklyList];
      updatedWeeklyList[editIndex] = newWeekly;

      try {
        // Check if the user has an existing document
        const q = query(
          collection(db, "Weeklys"),
          where("uid", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          // If the user has an existing document, update it
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, {
            content: updatedWeeklyList,
            updatedAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });
        }

        setWeeklyList(updatedWeeklyList);
        setNewWeekly("");
        setEditIndex(null);
      } catch (error) {
        console.error("Error completing edit:", error);
      }
    }
  };

  const handleRemoveTask = async (index: number) => {
    const updatedWeeklyList = [...WeeklyList];
    updatedWeeklyList.splice(index, 1);

    try {
      const q = query(collection(db, "Weeklys"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          content: updatedWeeklyList,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
      }

      setWeeklyList(updatedWeeklyList);
      setEditIndex(null); // Reset edit index when removing an item
    } catch (error) {
      console.error("Error removing Weekly task:", error);
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
        <div className="title">Weekly Goals</div>
        <div className="todo-list">
          {WeeklyList.map((Weekly, index) => (
            <div key={index} className="item">
              <input type="checkbox" name="" id="" />
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={newWeekly}
                    onChange={(e) => setNewWeekly(e.target.value)}
                  />
                  <IoMdCheckmarkCircleOutline onClick={handleCompleteEdit} />
                </>
              ) : (
                <div
                  className="item__content"
                  onClick={() => handleEditTask(index)}
                >
                  {Weekly}
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
        <form className="post-form" onSubmit={handleAddWeekly}>
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <div className="modal-header"></div>
              <div className="modal-content">
                <input
                  type="text"
                  placeholder="할 일을 입력하세요"
                  value={newWeekly}
                  onChange={handleWeeklyInputChange}
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

export default Weekly;
