import React, { useContext, useEffect, useState } from "react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { format } from "date-fns";
import Calendar from "./Calendar";
import { db } from "firebaseApp";
import { useTask } from "context/TaskContext";
import AuthContext from "context/AuthContext";
import {
  addDoc,
  collection,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";

interface DiaryProps {}

const Diary: React.FC<DiaryProps> = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [diaryContent, setDiaryContent] = useState<string>("");
  const [proudContent, setProudContent] = useState<string>("");
  const [betterContent, setBetterContent] = useState<string>("");
  const { user } = useContext(AuthContext);

  // Load diary content for the selected date
  useEffect(() => {
    const loadDiaryContent = async () => {
      if (!user || !selectedDate) {
        return; // Skip loading if user or selectedDate is undefined
      }

      try {
        const q = query(
          collection(db, "diaries"),
          where("uid", "==", user.uid)
          // Remove the date filter to fetch all diaries for the user
        );
        const querySnapshot = await getDocs(q);

        // Process the diaries as needed
        const diaries = querySnapshot.docs.map((doc) => doc.data());
        console.log("User diaries:", diaries);

        // Find the diary entry for the selected date, if any
        const diaryForSelectedDate = diaries.find(
          (diary) => diary.date === format(selectedDate, "yyyy-MM-dd")
        );

        if (diaryForSelectedDate) {
          // If a diary entry exists for the selected date, set the content
          setDiaryContent(diaryForSelectedDate.content);
        } else {
          // If no entry exists, clear the content
          setDiaryContent("");
        }
      } catch (error) {
        console.error("Error loading diaries:", error);
      }
    };

    loadDiaryContent();
  }, [selectedDate, user]);
  const saveDiaryEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !selectedDate || diaryContent.trim() === "") {
      alert("Please enter diary content and select a date before saving.");
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    try {
      // Check if the user has an existing document for the selected date
      const q = query(
        collection(db, "diaries"),
        where("uid", "==", user.uid),
        where("date", "==", formattedDate)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        // If the user has an existing document for the selected date, update it
        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
          content: diaryContent,
          proud: proudContent,
          better: betterContent,
          updatedAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
      } else {
        // If the user doesn't have an existing document for the selected date, add a new one
        const diaryCollection = collection(db, "diaries");
        await addDoc(diaryCollection, {
          uid: user.uid,
          date: formattedDate,
          content: diaryContent,
          proud: proudContent,
          better: betterContent,
          createdAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user.email,
        });

        console.log("Diary added to Firestore for date:", formattedDate);
      }

      setDiaryContent("");
    } catch (error) {
      console.error("Error adding/updating Diary:", error);
    }
  };

  return (
    <div>
      <div className="diary">
        {" "}
        <h1>하루 회고하기</h1>
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <form onSubmit={saveDiaryEntry} className="diary-form">
          <HiOutlineEmojiHappy />
          <textarea
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            placeholder="오늘 감사한 점은 무엇인가요?"
          />
          <HiOutlineEmojiHappy />
          <textarea
            value={proudContent}
            onChange={(e) => setProudContent(e.target.value)}
            placeholder="오늘 가장 자랑스러웠던 점은 무엇인가요?"
          />
          <HiOutlineEmojiHappy />
          <textarea
            value={betterContent}
            onChange={(e) => setBetterContent(e.target.value)}
            placeholder="오늘 더 잘할 수 있었을 점은 무엇인가요?"
          />
          <button type="submit">저장하기</button>
        </form>
      </div>
    </div>
  );
};

export default Diary;
