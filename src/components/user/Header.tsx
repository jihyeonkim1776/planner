import React, { useState, useEffect } from "react";
import { useTask } from "context/TaskContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  taskCount: number;
}

const Header: React.FC<HeaderProps> = ({ taskCount }) => {
  const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    // Unsubscribe to the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="header">
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
          <Link to="/login">Log in</Link>
        )}
        <Link to="/profile">
          <button>Profile</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
