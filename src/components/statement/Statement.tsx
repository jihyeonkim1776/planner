import React from "react";
import { Link } from "react-router-dom";

const Statement = () => {
  return (
    <div>
      <div className="statement">
        <div className="statement__confidence">
          {" "}
          <Link to="/statement/confidence">
            <button>
              <p>Confidence</p>
            </button>
          </Link>
        </div>
        <div className="statement__wealth">
          <Link to="/statement/wealth">
            <button>
              <p>Wealth</p>
            </button>
          </Link>
        </div>
        <div className="statement__rough">
          {" "}
          <Link to="/statement/rough">
            <button>
              <p>Rough Time</p>
            </button>
          </Link>
        </div>
        <div className="statement__positive">
          <Link to="/statement/self">
            <button>
              <p>Positive</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Statement;
