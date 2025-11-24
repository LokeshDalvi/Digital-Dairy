"use client"

import { ChevronLeft, ChevronRight, Settings } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} className="text-slate-700" />
        </button>
        <h2 className="text-2xl font-semibold text-slate-900 min-w-40">{monthYear}</h2>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} className="text-slate-700" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium">
          Week
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg transition-colors text-sm font-medium">
          Month
        </button>
        <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium">
          Day
        </button>
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2">
          <Settings size={20} />
        </button>
      </div>
    </div>
  )
}
