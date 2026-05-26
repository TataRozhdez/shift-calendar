'use client';

import { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  startOfMonth,
  subMonths,
} from 'date-fns';

import { getShiftByDate } from '@/lib/schedule';

type ShiftCalendarProps = {
  startDate: Date;
};

export default function ShiftCalendar({ startDate }: ShiftCalendarProps) {
  const [visibleDate, setVisibleDate] = useState(new Date());

  const monthStart = startOfMonth(visibleDate);
  const monthEnd = endOfMonth(visibleDate);

  const days = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  const handlePreviousMonth = () => {
    setVisibleDate((currentDate) => subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setVisibleDate((currentDate) => addMonths(currentDate, 1));
  };

  const handleCurrentMonth = () => {
    setVisibleDate(new Date());
  };

  return (
    <section className="flex-1 rounded-3xl bg-zinc-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {format(visibleDate, 'MMMM yyyy')}
          </h3>

          <button
            onClick={handleCurrentMonth}
            className="mt-1 text-xs text-zinc-400 hover:text-white"
          >
            Today
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="rounded-lg bg-zinc-800 px-3 py-1 hover:bg-zinc-700"
          >
            ←
          </button>

          <button
            onClick={handleNextMonth}
            className="rounded-lg bg-zinc-800 px-3 py-1 hover:bg-zinc-700"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
          <div key={day} className="pb-2 text-zinc-500">
            {day}
          </div>
        ))}

        {days.map((date) => {
          const shift = getShiftByDate(date, startDate);

          return (
            <div
              key={date.toISOString()}
              className={`
                flex aspect-square flex-col items-center justify-center rounded-xl border text-xs font-medium
                ${
                  isToday(date)
                    ? 'border-white bg-blue-500 text-white'
                    : shift.className
                }
              `}
            >
              <span>{format(date, 'd')}</span>
              <span className="mt-1 text-[9px]">{shift.shortLabel}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
