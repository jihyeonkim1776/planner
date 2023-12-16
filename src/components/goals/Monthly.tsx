import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
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

interface MonthlyProps {}

const Monthly: React.FC<MonthlyProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMonthly, setNewMonthly] = useState<string>("");
  const [MonthlyList, setMonthlyList] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const fetchMonthlys = async () => {
    if (user) {
      try {
        const q = query(
          collection(db, "Monthlys"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const MonthlysData = querySnapshot.docs[0].data();
          setMonthlyList(MonthlysData.content);
        }
      } catch (error) {
        console.error("Error fetching Monthlys:", error);
      }
    }
  };

  useEffect(() => {
    fetchMonthlys();
  }, []);

  const handleMonthlyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMonthly(e.target.value);
  };

  const handleAddMonthly = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newMonthly.trim() !== "") {
      const updatedMonthlyList = [...MonthlyList, newMonthly];

      try {
        // Check if the user has an existing document
        const querySnapshot = await getDocs(collection(db, "Monthlys"));

        if (querySnapshot.size > 0) {
          // If the user has an existing document, update it
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, {
            content: updatedMonthlyList,
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
          const docRef = await addDoc(collection(db, "Monthlys"), {
            content: updatedMonthlyList,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });

          console.log("Monthly added to Firestore with ID:", docRef.id);
        }

        setMonthlyList(updatedMonthlyList);
        setNewMonthly("");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error adding/updating Monthly:", error);
      }
    }
  };
  const handleRemoveTask = async (index: number) => {
    const updatedMonthlyList = [...MonthlyList];
    updatedMonthlyList.splice(index, 1);

    try {
      const q = query(
        collection(db, "Monthlys"),
        where("uid", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          content: updatedMonthlyList,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
      }

      setMonthlyList(updatedMonthlyList);
    } catch (error) {
      console.error("Error removing monthly task:", error);
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
        <div className="title">Monthly</div>
        <div className="todo-list">
          {MonthlyList.map((Monthly, index) => (
            <div key={index} className="item">
              <input type="checkbox" name="" id="" />
              <div className="item__content">{Monthly}</div>
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
        <form className="post-form" onSubmit={handleAddMonthly}>
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <div className="modal-header"></div>
              <div className="modal-content">
                <input
                  type="text"
                  placeholder="할 일을 입력하세요"
                  value={newMonthly}
                  onChange={handleMonthlyInputChange}
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

export default Monthly;
