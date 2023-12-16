import Monthly from "components/goals/Monthly";
import Weekly from "components/goals/Weekly";
import Yearly from "components/goals/Yearly";
import React, { useEffect, useState } from "react";

const GoalPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tasks for each component here

    // For example, fetch Yearly tasks
    // (Assuming your fetch function returns a Promise)
    const fetchYearlyTasks = async () => {
      // Your fetch logic here

      // Set loading to false after tasks are fetched
      setLoading(false);
    };

    fetchYearlyTasks();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  if (loading) {
    return <div>Loading...</div>; // You can customize the loading indicator
  }
  return (
    <div>
      <div className="todo-page-container">
        {" "}
        <Yearly />
        <Monthly />
        <Weekly />
      </div>
    </div>
  );
};

export default GoalPage;
