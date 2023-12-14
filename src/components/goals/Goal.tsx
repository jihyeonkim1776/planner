import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuEraser } from "react-icons/lu";

const Goal = () => {
  const [yearlyGoals, setYearlyGoals] = useState<string[]>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<string[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddTodo = (section: string) => {
    if (section === activeSection) {
      setActiveSection(null); // Hide the input container when clicking the same button again
      setEditIndex(null); // Clear edit index
    } else {
      setActiveSection(section); // Show the input container for the clicked button
      return;
    }

    if (newTodo.trim() === "") {
      return;
    }

    if (editIndex !== null) {
      // Editing an existing todo
      switch (section) {
        case "yearly":
          setYearlyGoals((prev) => {
            const updatedGoals = [...prev];
            updatedGoals[editIndex] = newTodo;
            return updatedGoals;
          });
          break;
        case "monthly":
          setMonthlyGoals((prev) => {
            const updatedGoals = [...prev];
            updatedGoals[editIndex] = newTodo;
            return updatedGoals;
          });
          break;
        case "weekly":
          setWeeklyGoals((prev) => {
            const updatedGoals = [...prev];
            updatedGoals[editIndex] = newTodo;
            return updatedGoals;
          });
          break;
        default:
          break;
      }
    } else {
      // Adding a new todo
      switch (section) {
        case "yearly":
          setYearlyGoals((prev) => [...prev, newTodo]);
          break;
        case "monthly":
          setMonthlyGoals((prev) => [...prev, newTodo]);
          break;
        case "weekly":
          setWeeklyGoals((prev) => [...prev, newTodo]);
          break;
        default:
          break;
      }
    }

    setNewTodo("");
    setEditIndex(null); // Clear edit index after adding/editing
  };

  const handleEditTodo = (section: string, index: number) => {
    setActiveSection(section);
    setNewTodo(
      section === "yearly"
        ? yearlyGoals[index]
        : section === "monthly"
        ? monthlyGoals[index]
        : weeklyGoals[index]
    );
    setEditIndex(index);
  };

  const handleDeleteTodo = (section: string, index: number) => {
    switch (section) {
      case "yearly":
        setYearlyGoals((prev) => prev.filter((_, i) => i !== index));
        break;
      case "monthly":
        setMonthlyGoals((prev) => prev.filter((_, i) => i !== index));
        break;
      case "weekly":
        setWeeklyGoals((prev) => prev.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  return (
    <div className="goal-container">
      {/* Yearly Goals Section */}
      <div className="goal-section">
        <h2>Yearly Goals</h2>
        <ul>
          {yearlyGoals.map((todo, index) => (
            <li key={index}>
              {todo}
              <button onClick={() => handleEditTodo("yearly", index)}>
                <LuEraser />
              </button>
              <button onClick={() => handleDeleteTodo("yearly", index)}>
                <FaRegTrashAlt />
              </button>
            </li>
          ))}
        </ul>
        <div
          className={`input-container ${
            activeSection === "yearly" ? "visible" : ""
          }`}
        >
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add or edit todo"
            name="yearly"
          />
        </div>
        <button onClick={() => handleAddTodo("yearly")}>+</button>
      </div>

      {/* Monthly Goals Section */}
      <div className="goal-section">
        <h2>Monthly Goals</h2>
        <ul>
          {monthlyGoals.map((todo, index) => (
            <li key={index}>
              {todo}
              <button onClick={() => handleEditTodo("monthly", index)}>
                <LuEraser />
              </button>
              <button onClick={() => handleDeleteTodo("monthly", index)}>
                <FaRegTrashAlt />
              </button>
            </li>
          ))}
        </ul>
        <div
          className={`input-container ${
            activeSection === "monthly" ? "visible" : ""
          }`}
        >
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add or edit todo"
            name="monthly"
          />
        </div>
        <button onClick={() => handleAddTodo("monthly")}>+</button>
      </div>

      {/* Weekly Goals Section */}
      <div className="goal-section">
        <h2>Weekly Goals</h2>
        <ul>
          {weeklyGoals.map((todo, index) => (
            <li key={index}>
              {todo}
              <button onClick={() => handleEditTodo("weekly", index)}>
                <LuEraser />
              </button>
              <button onClick={() => handleDeleteTodo("weekly", index)}>
                <FaRegTrashAlt />
              </button>
            </li>
          ))}
        </ul>
        <div
          className={`input-container ${
            activeSection === "weekly" ? "visible" : ""
          }`}
        >
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add or edit todo"
            name="weekly"
          />
        </div>
        <button onClick={() => handleAddTodo("weekly")}>+</button>
      </div>
    </div>
  );
};

export default Goal;
