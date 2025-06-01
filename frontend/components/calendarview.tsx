// frontend/components/CalendarView.tsx

import React from 'react';
import { Calendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars/src/types';

const PRIMARY_COLOR = '#2dbd20';
const TODAY_COLOR = '#4CAF50';

type Props = {
  markedDates: Record<string, {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    disabled?: boolean;
  }>;
  onDayPress?: (day: DateData) => void;
};

export default function CalendarView({ markedDates, onDayPress }: Props) {
  return (
    <Calendar
      onDayPress={onDayPress || (() => {})}
      markedDates={markedDates}
      theme={{
        todayTextColor: '#000000',
        todayBackgroundColor: TODAY_COLOR,
        monthTextColor: '#000000',
        arrowColor: PRIMARY_COLOR,
      }}
    />
  );
}
