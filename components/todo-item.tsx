"use client"

import { useState } from "react"
import { Trash2, Edit2, ChevronUp, ChevronDown, Check } from "lucide-react"

interface TodoItemProps {
  task: {
    id: string
    title: string
    isCompleted: boolean
  }
  index: number
  totalTasks: number
  onDelete: () => void
  onEdit: (newTitle: string) => void
  onToggleComplete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export default function TodoItem({
  task,
  index,
  totalTasks,
  onDelete,
  onEdit,
  onToggleComplete,
  onMoveUp,
  onMoveDown,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onEdit(editValue)
    } else {
      setEditValue(task.title)
    }
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
      <button
        onClick={onToggleComplete}
        className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded border border-slate-300 bg-white transition-all hover:border-blue-500"
        title="Mark as complete"
        aria-label="Toggle task completion"
      >
        {task.isCompleted && <Check size={16} className="text-green-600" />}
      </button>

      {/* Task Title */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveEdit()
              } else if (e.key === "Escape") {
                setEditValue(task.title)
                setIsEditing(false)
              }
            }}
            autoFocus
            className="w-full rounded border border-blue-400 bg-white px-2 py-1 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        ) : (
          <p className={`truncate ${task.isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}>
            {task.title}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-600 active:scale-95"
          title="Edit task"
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>

        {/* Move Up Button */}
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          title="Move up"
          aria-label="Move task up"
        >
          <ChevronUp size={18} />
        </button>

        {/* Move Down Button */}
        <button
          onClick={onMoveDown}
          disabled={index === totalTasks - 1}
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          title="Move down"
          aria-label="Move task down"
        >
          <ChevronDown size={18} />
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-600 active:scale-95"
          title="Delete task"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
