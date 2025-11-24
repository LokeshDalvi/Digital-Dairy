"use client"

import type React from "react"

import { useState } from "react"

interface TodoInputProps {
  selectedDate: string
  onAddTask: (title: string) => void
}

export default function TodoInput({ selectedDate, onAddTask }: TodoInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onAddTask(input)
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        disabled={!input.trim()}
      >
        ADD Task
      </button>
    </form>
  )
}
