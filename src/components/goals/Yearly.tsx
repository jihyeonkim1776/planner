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

interface YearlyProps {}

const Yearly: React.FC<YearlyProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newYearly, setNewYearly] = useState<string>("");
  const [YearlyList, setYearlyList] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track the index of the item being edited
  const { user } = useContext(AuthContext);

  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const fetchYearlys = async () => {
    if (user) {
      try {
        const q = query(
          collection(db, "Yearlys"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const YearlysData = querySnapshot.docs[0].data();
          setYearlyList(YearlysData.content);
        }
      } catch (error) {
        console.error("Error fetching Yearlys:", error);
      }
    }
  };

  useEffect(() => {
    fetchYearlys();
  }, []);

  const handleYearlyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewYearly(e.target.value);
  };

  const handleAddYearly = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newYearly.trim() !== "") {
      const updatedYearlyList = [...YearlyList, newYearly];

      try {
        // Check if the user has an existing document
        const q = query(
          collection(db, "Yearlys"),
          where("uid", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          // If the user has an existing document, update it
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, {
            content: updatedYearlyList,
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
          const docRef = await addDoc(collection(db, "Yearlys"), {
            content: updatedYearlyList,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });

          console.log("Yearly added to Firestore with ID:", docRef.id);
        }

        setYearlyList(updatedYearlyList);
        setNewYearly("");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error adding/updating Yearly:", error);
      }
    }
  };

  const handleEditTask = (index: number) => {
    setNewYearly(YearlyList[index]); // Set the text to be edited
    setEditIndex(index); // Set the index of the item being edited
  };

  const handleCompleteEdit = async () => {
    if (editIndex !== null && newYearly.trim() !== "") {
      const updatedYearlyList = [...YearlyList];
      updatedYearlyList[editIndex] = newYearly;

      try {
        // Check if the user has an existing document
        const q = query(
          collection(db, "Yearlys"),
          where("uid", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          // If the user has an existing document, update it
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, {
            content: updatedYearlyList,
            updatedAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user?.email,
            uid: user?.uid,
          });
        }

        setYearlyList(updatedYearlyList);
        setNewYearly("");
        setEditIndex(null);
      } catch (error) {
        console.error("Error completing edit:", error);
      }
    }
  };

  const handleRemoveTask = async (index: number) => {
    const updatedYearlyList = [...YearlyList];
    updatedYearlyList.splice(index, 1);

    try {
      const q = query(collection(db, "Yearlys"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          content: updatedYearlyList,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
      }

      setYearlyList(updatedYearlyList);
      setEditIndex(null); // Reset edit index when removing an item
    } catch (error) {
      console.error("Error removing Yearly task:", error);
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
        <div className="title">Yearly</div>
        <div className="todo-list">
          {YearlyList.map((Yearly, index) => (
            <div key={index} className="item">
              <input type="checkbox" name="" id="" />
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={newYearly}
                    onChange={(e) => setNewYearly(e.target.value)}
                  />
                  <IoMdCheckmarkCircleOutline onClick={handleCompleteEdit} />
                </>
              ) : (
                <div
                  className="item__content"
                  onClick={() => handleEditTask(index)}
                >
                  {Yearly}
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
        <form className="post-form" onSubmit={handleAddYearly}>
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <div className="modal-header"></div>
              <div className="modal-content">
                <input
                  type="text"
                  placeholder="할 일을 입력하세요"
                  value={newYearly}
                  onChange={handleYearlyInputChange}
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

export default Yearly;
