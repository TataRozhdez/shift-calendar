'use client';

import { useState } from 'react';

import { shifts, type ShiftType } from '@/lib/schedule';
import type { Schedule } from '@/types/schedule';

type ScheduleFormProps = {
  onCreate: (schedule: Schedule) => void;
};

const shiftOptions: ShiftType[] = ['day', 'night', 'sleep', 'off'];

export default function ScheduleForm({ onCreate }: ScheduleFormProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [pattern, setPattern] = useState<ShiftType[]>([
    'day',
    'night',
    'sleep',
    'off',
  ]);

  const handleAddShift = (shiftType: ShiftType) => {
    setPattern((currentPattern) => [...currentPattern, shiftType]);
  };

  const handleRemoveShift = (indexToRemove: number) => {
    setPattern((currentPattern) =>
      currentPattern.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleClearPattern = () => {
    setPattern([]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !startDate || pattern.length === 0) {
      return;
    }

    onCreate({
      id: crypto.randomUUID(),
      name: name.trim(),
      startDate,
      pattern,
    });

    setName('');
    setStartDate('');
    setPattern(['day', 'night', 'sleep', 'off']);
  };

  return (
    <section className="rounded-3xl bg-zinc-900 p-5">
      <h2 className="mb-2 text-2xl font-bold">Create your schedule</h2>

      <p className="mb-6 text-sm text-zinc-400">
        Choose the first day and build your shift cycle.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm text-zinc-300">
            Schedule name
          </span>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="My work schedule"
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-300">
            First day of cycle
          </span>

          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-zinc-300">Shift cycle</span>

            <button
              type="button"
              onClick={handleClearPattern}
              className="text-xs text-zinc-500 hover:text-red-300"
            >
              Clear
            </button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {shiftOptions.map((shiftType) => {
              const shift = shifts[shiftType];

              return (
                <button
                  key={shiftType}
                  type="button"
                  onClick={() => handleAddShift(shiftType)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-medium ${shift.className}`}
                >
                  + {shift.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="min-h-16 rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
            {pattern.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Add at least one shift to create a cycle.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {pattern.map((shiftType, index) => {
                  const shift = shifts[shiftType];

                  return (
                    <button
                      key={`${shiftType}-${index}`}
                      type="button"
                      onClick={() => handleRemoveShift(index)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium ${shift.className}`}
                      title="Click to remove"
                    >
                      {index + 1}. {shift.shortLabel} ×
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim() || !startDate || pattern.length === 0}
          className="w-full rounded-2xl bg-blue-500 px-4 py-3 font-medium transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          Create schedule
        </button>
      </form>
    </section>
  );
}
