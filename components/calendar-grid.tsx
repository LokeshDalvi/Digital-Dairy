"use client"

interface Task {
  id: string
  title: string
  isCompleted: boolean
  date: string
  time?: string
}

interface CalendarGridProps {
  currentDate: Date
  tasks: Task[]
  selectedDate: string
  onDateSelect: (date: string) => void
}

export default function CalendarGrid({ currentDate, tasks, selectedDate, onDateSelect }: CalendarGridProps) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())

  const days: Date[] = []
  const current = new Date(startDate)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateStr)
  }

  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth()

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-semibold text-slate-600 text-sm py-3">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 auto-rows-[120px]">
        {days.map((date, index) => {
          const dateStr = date.toISOString().split("T")[0]
          const dayTasks = getTasksForDate(date)
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === new Date().toISOString().split("T")[0]
          const isCurrentMonthDay = isCurrentMonth(date)

          return (
            <div
              key={index}
              onClick={() => onDateSelect(dateStr)}
              className={`rounded-lg border cursor-pointer transition-all overflow-hidden flex flex-col ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isToday
                    ? "border-orange-400 bg-orange-50"
                    : isCurrentMonthDay
                      ? "border-slate-200 bg-white hover:bg-slate-50"
                      : "border-slate-100 bg-slate-50"
              }`}
            >
              {/* Date Number */}
              <div
                className={`px-3 py-2 font-semibold text-sm ${isCurrentMonthDay ? "text-slate-900" : "text-slate-400"}`}
              >
                {date.getDate()}
              </div>

              {/* Tasks Preview */}
              <div className="flex-1 overflow-hidden px-2 pb-2 space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs px-2 py-1 rounded truncate ${
                      task.isCompleted ? "bg-slate-200 text-slate-500 line-through" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs px-2 py-1 text-slate-500">+{dayTasks.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
