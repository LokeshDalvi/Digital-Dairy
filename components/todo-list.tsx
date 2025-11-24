"use client"

import { useState } from "react"
import TodoInput from "./todo-input"
import TodoItem from "./todo-item"

interface Task {
  id: string
  title: string
  isCompleted: boolean
  date: string // "YYYY-MM-DD"
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Morning walk", isCompleted: false, date: "2025-11-24" },
    { id: "2", title: "Write journal entry", isCompleted: true, date: "2025-11-24" },
    { id: "3", title: "Prepare meeting notes", isCompleted: false, date: "2025-11-24" },
    { id: "4", title: "Review project proposal", isCompleted: false, date: "2025-11-25" },
    { id: "5", title: "Plan next week goals", isCompleted: false, date: "2025-11-25" },
    { id: "6", title: "Coffee with Sarah", isCompleted: true, date: "2025-11-23" },
  ])

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Initialize to today in YYYY-MM-DD format
    const today = new Date()
    return today.toISOString().split("T")[0]
  })

  const tasksForSelectedDate = tasks.filter((task) => task.date === selectedDate)

  const completedCount = tasksForSelectedDate.filter((t) => t.isCompleted).length
  const pendingCount = tasksForSelectedDate.length - completedCount

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleAddTask = (title: string) => {
    // TODO: Later integrate with Supabase/Prisma
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      isCompleted: false,
      date: selectedDate, // Use selected date for new tasks
    }
    setTasks([...tasks, newTask])
  }

  const handleDeleteTask = (id: string) => {
    // TODO: Later integrate with Supabase/Prisma
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (id: string, newTitle: string) => {
    // TODO: Later integrate with Supabase/Prisma
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title: newTitle } : task)))
  }

  const handleToggleComplete = (id: string) => {
    // TODO: Later integrate with Supabase/Prisma
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)))
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newTasks = [...tasksForSelectedDate]
      ;[newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]]
      // Update full tasks array with reordered tasks for this date
      const updatedTasks = tasks.map((task) => {
        const reorderedTask = newTasks.find((t) => t.id === task.id)
        return reorderedTask || task
      })
      setTasks(updatedTasks)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < tasksForSelectedDate.length - 1) {
      const newTasks = [...tasksForSelectedDate]
      ;[newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]]
      // Update full tasks array with reordered tasks for this date
      const updatedTasks = tasks.map((task) => {
        const reorderedTask = newTasks.find((t) => t.id === task.id)
        return reorderedTask || task
      })
      setTasks(updatedTasks)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-xl bg-white shadow-lg p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-900">My Digital Diary</h1>
          <p className="mt-1 text-sm text-slate-600">Plan your day, one date at a time</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          {/* Left Panel: Date Selection & Calendar */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-4">SELECT DATE</h2>

            <div className="mb-6">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Date summary */}
            <div className="rounded-lg bg-white p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Selected Date</p>
              <p className="text-lg font-semibold text-slate-900">{formatDate(selectedDate)}</p>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Tasks</span>
                  <span className="font-semibold text-slate-900">{tasksForSelectedDate.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Completed</span>
                  <span className="font-semibold text-green-600">{completedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Remaining</span>
                  <span className="font-semibold text-slate-900">{pendingCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Tasks for Selected Date */}
          <div>
            {/* Task Input */}
            <div className="mb-6">
              <TodoInput selectedDate={selectedDate} onAddTask={handleAddTask} />
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {tasksForSelectedDate.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-slate-500">No tasks for this date. Add one to get started!</p>
                </div>
              ) : (
                tasksForSelectedDate.map((task, index) => (
                  <TodoItem
                    key={task.id}
                    task={task}
                    index={index}
                    totalTasks={tasksForSelectedDate.length}
                    onDelete={() => handleDeleteTask(task.id)}
                    onEdit={(newTitle) => handleEditTask(task.id, newTitle)}
                    onToggleComplete={() => handleToggleComplete(task.id)}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                  />
                ))
              )}
            </div>

            {/* Task Summary Footer */}
            {tasksForSelectedDate.length > 0 && (
              <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{tasksForSelectedDate.length}</span> task
                  {tasksForSelectedDate.length !== 1 ? "s" : ""} for this day
                  {completedCount > 0 && (
                    <>
                      {" • "}
                      <span className="font-semibold text-green-600">{completedCount}</span> completed
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
