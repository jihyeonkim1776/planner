import React, { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const footer = selectedDate ? <p></p> : <p>Please pick a day.</p>;

  return (
    <DayPicker
      mode="single"
      required
      selected={selectedDate}
      onSelect={(date) => onDateChange(date as Date)}
      footer={footer}
    />
  );
};

export default Calendar;
