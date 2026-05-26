'use client';

import { useEffect, useMemo, useState } from 'react';

import ShiftCalendar from '@/components/calendar/ShiftCalendar';
import ScheduleForm from '@/components/schedules/ScheduleForm';
import { getShiftByDate } from '@/lib/schedule';
import type { Schedule } from '@/types/schedule';

const STORAGE_KEY = 'shift-calendar:schedules';
const ACTIVE_SCHEDULE_KEY = 'shift-calendar:active-schedule-id';

export default function Home() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSchedules = localStorage.getItem(STORAGE_KEY);
    const savedActiveScheduleId = localStorage.getItem(ACTIVE_SCHEDULE_KEY);

    if (savedSchedules) {
      const parsedSchedules = JSON.parse(savedSchedules) as Schedule[];

      setSchedules(parsedSchedules);

      if (savedActiveScheduleId) {
        setActiveScheduleId(savedActiveScheduleId);
      } else {
        setActiveScheduleId(parsedSchedules[0]?.id ?? null);
      }
    }

    setIsLoaded(true);
  }, []);

  const activeSchedule = useMemo(() => {
    return (
      schedules.find((schedule) => schedule.id === activeScheduleId) ?? null
    );
  }, [schedules, activeScheduleId]);

  const handleCreateSchedule = (newSchedule: Schedule) => {
    const nextSchedules = [newSchedule, ...schedules];

    setSchedules(nextSchedules);
    setActiveScheduleId(newSchedule.id);
    setIsCreating(false);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSchedules));
    localStorage.setItem(ACTIVE_SCHEDULE_KEY, newSchedule.id);
  };

  const handleSelectSchedule = (scheduleId: string) => {
    setActiveScheduleId(scheduleId);
    localStorage.setItem(ACTIVE_SCHEDULE_KEY, scheduleId);
    setIsCreating(false);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const nextSchedules = schedules.filter(
      (schedule) => schedule.id !== scheduleId
    );

    const nextActiveScheduleId =
      activeScheduleId === scheduleId
        ? (nextSchedules[0]?.id ?? null)
        : activeScheduleId;

    setSchedules(nextSchedules);
    setActiveScheduleId(nextActiveScheduleId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSchedules));

    if (nextActiveScheduleId) {
      localStorage.setItem(ACTIVE_SCHEDULE_KEY, nextActiveScheduleId);
    } else {
      localStorage.removeItem(ACTIVE_SCHEDULE_KEY);
    }
  };

  const handleStartCreating = () => {
    setIsCreating(true);
  };

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading...
      </main>
    );
  }

  const scheduleStartDate = activeSchedule
    ? new Date(activeSchedule.startDate)
    : null;

  const todayShift = scheduleStartDate
    ? getShiftByDate(new Date(), scheduleStartDate)
    : null;

  const shouldShowForm = isCreating || !activeSchedule;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Shift Calendar</h1>
            <p className="text-sm text-zinc-400">
              {activeSchedule?.name ?? 'Create your first schedule'}
            </p>
          </div>

          <button
            onClick={handleStartCreating}
            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium transition hover:bg-blue-400"
          >
            New
          </button>
        </header>

        {schedules.length > 0 && (
          <section className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
              History
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {schedules.map((schedule) => {
                const isActive = schedule.id === activeScheduleId;

                return (
                  <div
                    key={schedule.id}
                    className={`
              flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition
              ${
                isActive
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400'
              }
            `}
                  >
                    <button
                      onClick={() => handleSelectSchedule(schedule.id)}
                      className="text-left"
                    >
                      <span className="block font-medium">{schedule.name}</span>
                      <span className="text-xs text-zinc-500">
                        from {schedule.startDate}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="rounded-full px-2 py-1 text-zinc-500 hover:bg-zinc-800 hover:text-red-300"
                      aria-label={`Delete ${schedule.name}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {shouldShowForm ? (
          <ScheduleForm onCreate={handleCreateSchedule} />
        ) : (
          <>
            {todayShift && (
              <section className="mb-6 rounded-3xl bg-zinc-900 p-5 shadow-lg">
                <p className="mb-2 text-sm text-zinc-400">Today</p>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">{todayShift.label}</h2>

                    <p className="mt-1 text-zinc-400">{todayShift.time}</p>
                  </div>

                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${todayShift.className}`}
                  >
                    {todayShift.shortLabel}
                  </div>
                </div>
              </section>
            )}

            {scheduleStartDate && (
              <ShiftCalendar startDate={scheduleStartDate} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
