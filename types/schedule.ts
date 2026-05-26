import type { ShiftType } from '@/lib/schedule';

export type Schedule = {
  id: string;
  name: string;
  startDate: string;
  pattern: ShiftType[];
};
