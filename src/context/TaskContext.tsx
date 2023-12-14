import React, { createContext, useContext, ReactNode, useState } from "react";

interface TaskContextProps {
  children: ReactNode;
}

interface TaskContextValue {
  taskCount: number;
  setTaskCount: React.Dispatch<React.SetStateAction<number>>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<TaskContextProps> = ({ children }) => {
  const [taskCount, setTaskCount] = useState<number>(0);

  const value: TaskContextValue = {
    taskCount,
    setTaskCount,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }

  return context;
};
