import React from "react";
import { Link } from "react-router-dom";

const Statement = () => {
  return (
    <div>
      <Link to="/statement/confidence">
        <div>Confidence</div>
      </Link>
      <Link to="/statement/wealth">
        <div>Wealth</div>
      </Link>
    </div>
  );
};

export default Statement;
