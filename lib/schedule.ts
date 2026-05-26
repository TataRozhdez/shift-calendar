import { differenceInCalendarDays } from "date-fns";

export type ShiftType = "day" | "night" | "sleep" | "off";

export type Shift = {
  type: ShiftType;
  label: string;
  shortLabel: string;
  time: string;
  className: string;
};

export const shiftPattern: Shift[] = [
  {
    type: "day",
    label: "Day Shift",
    shortLabel: "DAY",
    time: "08:00 — 20:00",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    type: "night",
    label: "Night Shift",
    shortLabel: "NIGHT",
    time: "20:00 — 08:00",
    className: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    type: "sleep",
    label: "Recovery Day",
    shortLabel: "SLEEP",
    time: "After night shift",
    className: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  {
    type: "off",
    label: "Day Off",
    shortLabel: "OFF",
    time: "Free day",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
];

export function getShiftByDate(date: Date, startDate: Date): Shift {
  const diffDays = differenceInCalendarDays(date, startDate);

  const patternIndex =
    ((diffDays % shiftPattern.length) + shiftPattern.length) %
    shiftPattern.length;

  return shiftPattern[patternIndex];
}