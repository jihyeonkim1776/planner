import Calendar from "components/posts/Calendar";
import Project from "components/posts/Project";
import Task from "components/posts/Task";
import React from "react";

export default function TodoPage() {
  return (
    <>
      {" "}
      <Calendar />
      <Project />
      <Task />
    </>
  );
}
