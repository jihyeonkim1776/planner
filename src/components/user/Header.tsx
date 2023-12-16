import React, { useState, useEffect } from "react";
import { useTask } from "context/TaskContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { Link } from "react-router-dom";

interface HeaderProps {
  taskCount: number;
}

const Header: React.FC<HeaderProps> = ({ taskCount }) => {
  const { setTaskCount } = useTask();
  const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);

      // 로그인 상태에 따라 taskCount 업데이트
      if (user) {
        setTaskCount(taskCount); // taskCount를 다시 설정하거나, 필요한 값으로 업데이트
      } else {
        setTaskCount(taskCount);
      }
    });

    // Unsubscribe to the listener when the component unmounts
    return () => unsubscribe();
  }, [auth, setTaskCount, taskCount]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      // Update the task count when signing out
      setTaskCount(0);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="header">
      <div className="inner">
        {" "}
        <Link to="/" className="header__logo">
          {isAuthenticated
            ? `You've got ${taskCount} ${
                taskCount === 1 ? "task" : "tasks"
              } today`
            : "Welcome"}
        </Link>
        <div className="header__sub-menu">
          {isAuthenticated ? (
            <button onClick={handleSignOut}>Sign out</button>
          ) : (
            <button>
              <Link to="/login">Log in</Link>
            </button>
          )}
          <Link to="/profile">
            <button>Profile</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
