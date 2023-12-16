import Monthly from "components/goals/Monthly";
import Weekly from "components/goals/Weekly";
import Yearly from "components/goals/Yearly";
import React from "react";

const GoalPage = () => {
  return (
    <div>
      <Yearly />
      <Monthly />
      <Weekly />
    </div>
  );
};

export default GoalPage;
