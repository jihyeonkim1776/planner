import React, { useContext, useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";

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

interface WeeklyProps {}

const Weekly: React.FC<WeeklyProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeekly, setNewWeekly] = useState<string>("");
  const [WeeklyList, setWeeklyList] = useState<string[]>([]);
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
  return (
    <div>
      <div className="todo">
        <div className="title">Weekly</div>
        <div className="todo-list">
          {WeeklyList.map((Weekly, index) => (
            <div key={index} className="item">
              <input type="checkbox" name="" id="" />
              <div className="item__content">{Weekly}</div>
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
        <form className="post-form" onSubmit={handleAddWeekly}>
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header"></div>
              <div className="modal-content">
                <input
                  type="text"
                  placeholder="할 일을 입력하세요"
                  value={newWeekly}
                  onChange={handleWeeklyInputChange}
                />
                <button type="submit">Add Weekly</button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Weekly;
