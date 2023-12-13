import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="menu-container">
        <div className="menu">
          <div className="menu__mind-set">
            <Link to="/dream">
              <button>Dream Life</button>
            </Link>
          </div>
          <div className="menu__todo">
            <Link to="/todo">
              <button>todo</button>
            </Link>
          </div>
          <div className="menu__goal">
            <Link to="/goal">
              <button>Goals</button>
            </Link>
          </div>
          <div className="menu__profile">
            <Link to="/profile">
              <button>profile</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
