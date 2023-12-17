// index.tsx
import Calendar from "components/memory/Calendar";
import Diary from "components/memory/Diary";
import React, { useState } from "react";

const MemoryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <Diary />
    </div>
  );
};

export default MemoryPage;
