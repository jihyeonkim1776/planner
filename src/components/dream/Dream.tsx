import React, { useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { useNavigate } from "react-router-dom";

export default function Dream() {
  const [content, setContent] = useState<string>("");
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<any>("");
  const [latestPost, setLatestPost] = useState<any>("");
  const navigate = useNavigate();

  const getPost = async (userId: string) => {
    if (userId) {
      // Query to get the latest post of the specified user
      const q = query(
        collection(db, "posts"),
        where("uid", "==", userId),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestPostData = querySnapshot.docs[0].data();
        setPost({ id: querySnapshot.docs[0].id, ...latestPostData });
        setContent(latestPostData.content);
      } else {
        // If no post is found, set post state to null
        setPost(null);
        setContent("");
      }
    }
  };

  useEffect(() => {
    // Fetch the post when the user changes
    const fetchPost = async () => {
      try {
        if (user?.uid) {
          // Query to get the latest post of the specified user
          const q = query(
            collection(db, "posts"),
            where("uid", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(1)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const latestPostData = querySnapshot.docs[0].data();
            setPost({ id: querySnapshot.docs[0].id, ...latestPostData });
            setContent(latestPostData.content);
          } else {
            // If no post is found, set post state to an empty object
            setPost({});
            setContent("");
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [user?.uid]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (user?.uid && post.id) {
        // If post data exists, update the Firestore document with the same UID
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
      } else {
        // If post data doesn't exist, add a new Firestore document with the same UID
        await addDoc(collection(db, "posts"), {
          content: content,
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  return (
    <div>
      <div className="goal-content">
        <div className="text-group">
          <div className="text-group__title">The Dream Life</div>
          <form className="post-form" onSubmit={onSubmit}>
            <textarea
              name="content"
              onChange={onChange}
              value={content}
              className="textarea-focused"
              placeholder="Write your post here..."
            />
            <button type="submit">save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
