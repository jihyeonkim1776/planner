import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="menu-container">
        <div className="menu">
          <div className="menu__mind-set">
            <Link to="/dream">
              <button>
                <p>Dream Life</p>
              </button>
            </Link>
          </div>
          <div className="menu__todo">
            <Link to="/todo">
              <button>
                <p>Todo</p>
              </button>
            </Link>
          </div>
          <div className="menu__goal">
            <Link to="/goal">
              <button>
                <p>Goals</p>
              </button>
            </Link>
          </div>
          <div className="menu__profile">
            <Link to="/profile">
              <button>
                <p>Profile</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
