import { useTask } from "context/TaskContext";
import React, { ReactNode, useState, useEffect } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { taskCount, setTaskCount } = useTask();

  useEffect(() => {
    // Fetch or calculate taskCount here and update it using setTaskCount
    // For example, you can fetch it from an API
    const fetchTaskCount = async () => {
      try {
        const response = await fetch("your_api_endpoint");
        const data = await response.json();
        setTaskCount(data.taskCount);
      } catch (error) {
        console.error("Error fetching task count:", error);
      }
    };

    fetchTaskCount();
  }, [setTaskCount]);

  return (
    <div className="layout">
      <Header taskCount={taskCount} />
      <div className="background"></div>
      {children}
    </div>
  );
};
