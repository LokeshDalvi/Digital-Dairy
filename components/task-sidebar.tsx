"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Check } from "lucide-react"

interface Task {
  id: string
  title: string
  isCompleted: boolean
  date: string
  time?: string
}

interface TaskSidebarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  tasks: Task[]
  onAddTask: (title: string) => void
  onDeleteTask: (id: string) => void
  onEditTask: (id: string, newTitle: string) => void
  onToggleComplete: (id: string) => void
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function TaskSidebar({
  selectedDate,
  onDateSelect,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onToggleComplete,
  currentDate,
  onPrevMonth,
  onNextMonth,
}: TaskSidebarProps) {
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onAddTask(input)
      setInput("")
    }
  }

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onEditTask(id, editValue)
    }
    setEditingId(null)
  }

  const selectedDateObj = new Date(selectedDate)
  const formattedDate = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  // Mini calendar
  const miniCalendarDate = new Date(currentDate)
  const miniFirstDay = new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), 1)
  const miniStartDate = new Date(miniFirstDay)
  miniStartDate.setDate(miniStartDate.getDate() - miniFirstDay.getDay())

  const miniDays: Date[] = []
  const miniCurrent = new Date(miniStartDate)
  for (let i = 0; i < 42; i++) {
    miniDays.push(new Date(miniCurrent))
    miniCurrent.setDate(miniCurrent.getDate() + 1)
  }

  return (
    <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
      </div>

      {/* Mini Calendar */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">
            {miniCalendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex gap-2">
            <button onClick={onPrevMonth} className="p-1 hover:bg-slate-100 rounded transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={onNextMonth} className="p-1 hover:bg-slate-100 rounded transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mini weekdays */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-slate-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Mini calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {miniDays.map((date, index) => {
            const dateStr = date.toISOString().split("T")[0]
            const isSelected = dateStr === selectedDate
            const isMiniCurrentMonth = date.getMonth() === miniCalendarDate.getMonth()

            return (
              <button
                key={index}
                onClick={() => onDateSelect(dateStr)}
                className={`aspect-square text-xs rounded flex items-center justify-center font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isMiniCurrentMonth
                      ? "text-slate-900 hover:bg-slate-100"
                      : "text-slate-300"
                }`}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Date & Tasks */}
      <div className="flex-1 flex flex-col overflow-hidden border-b border-slate-200">
        {/* Selected Date */}
        <div className="p-6 border-b border-slate-200">
          <p className="text-slate-600 text-sm mb-1">Selected date</p>
          <p className="text-lg font-semibold text-slate-900">{formattedDate}</p>
        </div>

        {/* Add Task Form */}
        <div className="p-6 border-b border-slate-200">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add task..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!input.trim()}
            >
              <Plus size={18} />
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {tasks.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No tasks for this date</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
              >
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className="flex-shrink-0 w-5 h-5 rounded border border-slate-300 bg-white flex items-center justify-center hover:border-blue-500 transition-colors"
                >
                  {task.isCompleted && <Check size={14} className="text-green-600" />}
                </button>

                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveEdit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(task.id)
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    autoFocus
                    className="flex-1 rounded border border-blue-400 px-2 py-1 text-sm focus:outline-none"
                  />
                ) : (
                  <span
                    className={`flex-1 text-sm truncate ${
                      task.isCompleted ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </span>
                )}

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(task.id)
                      setEditValue(task.title)
                    }}
                    className="p-1 text-slate-600 hover:bg-blue-100 rounded transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 text-slate-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200 text-xs text-slate-500 text-center">
        {tasks.length} task{tasks.length !== 1 ? "s" : ""} · {tasks.filter((t) => !t.isCompleted).length} active
      </div>
    </div>
  )
}
