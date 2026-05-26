"use client";

import { useState } from "react";
import type { Schedule } from "@/types/schedule";

type ScheduleFormProps = {
  onCreate: (schedule: Schedule) => void;
};

export default function ScheduleForm({ onCreate }: ScheduleFormProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !startDate) {
      return;
    }

    onCreate({
      id: crypto.randomUUID(),
      name,
      startDate,
    });
  };

  return (
    <section className="rounded-3xl bg-zinc-900 p-5">
      <h2 className="mb-2 text-2xl font-bold">
        Create your schedule
      </h2>

      <p className="mb-6 text-sm text-zinc-400">
        Set the first day of your shift cycle.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          className="w-full rounded-2xl bg-blue-500 px-4 py-3 font-medium transition hover:bg-blue-400"
        >
          Create schedule
        </button>
      </form>
    </section>
  );
}