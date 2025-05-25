// components/CalendarView.tsx
import React from 'react';
import { Calendar, DateData } from 'react-native-calendars';

type Props = {
  markedDates: Record<string, { marked: boolean; dotColor?: string }>;
  onDayPress?: (day: DateData) => void;
};

export default function CalendarView({ markedDates, onDayPress }: Props) {
  return (
    <Calendar
      onDayPress={onDayPress}
      markedDates={markedDates}
      // customize colors to match your design:
      theme={{
        todayTextColor: '#00000',
        todayBackgroundColor: '#4CAF50',
        monthTextColor: '#00000',
        arrowColor: '#2dbd20',
      }}
    />
  );
}
