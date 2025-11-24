"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Trash2, Edit2, ChevronUp, ChevronDown, Check } from "lucide-react"

interface Task {
  id: string
  title: string
  isCompleted: boolean
  date: string
  time?: string
}

interface DateModalProps {
  selectedDate: string
  tasks: Task[]
  onClose: () => void
  onAddTask: (title: string) => void
  onDeleteTask: (id: string) => void
  onEditTask: (id: string, newTitle: string) => void
  onToggleComplete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

export default function DateModal({
  selectedDate,
  tasks,
  onClose,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onToggleComplete,
  onMoveUp,
  onMoveDown,
}: DateModalProps) {
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
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
            <div>
              <p className="text-sm text-slate-600">Selected date</p>
              <h2 className="text-2xl font-bold text-slate-900">{formattedDate}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium flex items-center gap-2"
                disabled={!input.trim()}
              >
                <Plus size={18} />
                Add
              </button>
            </form>

            {/* Tasks List */}
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-slate-500">
                <p>No tasks for this date. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="flex-shrink-0 w-6 h-6 rounded border-2 border-slate-300 bg-white flex items-center justify-center hover:border-blue-500 transition-colors"
                    >
                      {task.isCompleted && <Check size={18} className="text-green-600" />}
                    </button>

                    {/* Task Title */}
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
                        className="flex-1 rounded border border-blue-400 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      <span
                        className={`flex-1 text-base ${
                          task.isCompleted ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </span>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-100">
                      <button
                        onClick={() => {
                          setEditingId(task.id)
                          setEditValue(task.title)
                        }}
                        className="p-2 text-slate-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => onMoveUp(task.id)}
                        disabled={index === 0}
                        className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp size={18} />
                      </button>

                      <button
                        onClick={() => onMoveDown(task.id)}
                        disabled={index === tasks.length - 1}
                        className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown size={18} />
                      </button>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between text-sm text-slate-600">
            <span>
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
            <span>{tasks.filter((t) => !t.isCompleted).length} active</span>
          </div>
        </div>
      </div>
    </>
  )
}
