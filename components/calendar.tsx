"use client"

import { useState } from "react"
import CalendarHeader from "./calendar-header"
import CalendarGrid from "./calendar-grid"
import TaskSidebar from "./task-sidebar"
import DateModal from "./date-modal"

interface Task {
  id: string
  title: string
  isCompleted: boolean
  date: string
  time?: string
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 24)) // Nov 24, 2025
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Morning walk", isCompleted: false, date: "2025-11-24", time: "07:00" },
    { id: "2", title: "Team meeting", isCompleted: false, date: "2025-11-24", time: "10:00" },
    { id: "3", title: "Write journal entry", isCompleted: true, date: "2025-11-24", time: "20:00" },
    { id: "4", title: "Review proposal", isCompleted: false, date: "2025-11-25", time: "14:00" },
    { id: "5", title: "Coffee with Sarah", isCompleted: true, date: "2025-11-23", time: "15:00" },
    { id: "6", title: "Doctor appointment", isCompleted: false, date: "2025-11-26", time: "09:30" },
    { id: "7", title: "Gym session", isCompleted: false, date: "2025-11-24", time: "18:00" },
    { id: "8", title: "Dinner reservations", isCompleted: false, date: "2025-11-27", time: "19:00" },
  ])
  const [selectedDate, setSelectedDate] = useState("2025-11-24")
  const [showModal, setShowModal] = useState(false)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleAddTask = (title: string, date: string, time?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      isCompleted: false,
      date,
      time,
    }
    setTasks([...tasks, newTask])
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (id: string, newTitle: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title: newTitle } : task)))
  }

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)))
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setShowModal(true)
  }

  const handleMoveTask = (id: string, direction: "up" | "down") => {
    const tasksForDate = tasks.filter((t) => t.date === selectedDate)
    const taskIndex = tasksForDate.findIndex((t) => t.id === id)

    if ((direction === "up" && taskIndex > 0) || (direction === "down" && taskIndex < tasksForDate.length - 1)) {
      const newTasks = [...tasks]
      const allTasksForDate = newTasks.filter((t) => t.date === selectedDate)
      const currentTaskIndex = newTasks.findIndex((t) => t.id === id)

      if (direction === "up") {
        const prevTaskIndex = newTasks.findIndex(
          (t) => t.date === selectedDate && newTasks.indexOf(t) < currentTaskIndex,
        )
        if (prevTaskIndex !== -1) {
          ;[newTasks[currentTaskIndex], newTasks[prevTaskIndex]] = [newTasks[prevTaskIndex], newTasks[currentTaskIndex]]
        }
      } else {
        const nextTaskIndex = newTasks.findIndex(
          (t) => t.date === selectedDate && newTasks.indexOf(t) > currentTaskIndex,
        )
        if (nextTaskIndex !== -1) {
          ;[newTasks[currentTaskIndex], newTasks[nextTaskIndex]] = [newTasks[nextTaskIndex], newTasks[currentTaskIndex]]
        }
      }

      setTasks(newTasks)
    }
  }

  return (
    <div className="flex h-screen bg-white relative">
      {/* Sidebar */}
      <TaskSidebar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        tasks={tasks.filter((t) => t.date === selectedDate)}
        onAddTask={(title) => handleAddTask(title, selectedDate)}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
        onToggleComplete={handleToggleComplete}
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col border-l border-slate-200">
        <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
        <CalendarGrid
          currentDate={currentDate}
          tasks={tasks}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Modal Overlay for Expanded Date View */}
      {showModal && (
        <DateModal
          selectedDate={selectedDate}
          tasks={tasks.filter((t) => t.date === selectedDate)}
          onClose={() => setShowModal(false)}
          onAddTask={(title) => handleAddTask(title, selectedDate)}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onToggleComplete={handleToggleComplete}
          onMoveUp={(id) => handleMoveTask(id, "up")}
          onMoveDown={(id) => handleMoveTask(id, "down")}
        />
      )}
    </div>
  )
}
