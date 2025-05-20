"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Memory = {
  id: number
  title: string
  date: string
  description: string
  image: string
  month: string
}

// Initial sample data
const initialMemories: Memory[] = [
  {
    id: 1,
    date: "January 15, 2023",
    title: "First Smile",
    description:
      "Noah smiled for the first time today! It was during his morning feeding, and it was the most precious thing we've ever seen.",
    image: "/placeholder.svg?height=400&width=600",
    month: "January",
  },
  {
    id: 2,
    date: "February 3, 2023",
    title: "Tummy Time Champion",
    description: "Noah held his head up during tummy time for a full minute today! He's getting stronger every day.",
    image: "/placeholder.svg?height=400&width=600",
    month: "February",
  },
  {
    id: 3,
    date: "February 28, 2023",
    title: "First Laugh",
    description: "Noah laughed out loud for the first time when playing peek-a-boo. The sound was magical!",
    image: "/placeholder.svg?height=400&width=600",
    month: "February",
  },
  {
    id: 4,
    date: "March 15, 2023",
    title: "Rolling Over",
    description: "Big milestone today! Noah rolled over from his back to his tummy all by himself.",
    image: "/placeholder.svg?height=400&width=600",
    month: "March",
  },
  {
    id: 5,
    date: "April 10, 2023",
    title: "First Solid Food",
    description: "Noah tried sweet potatoes today. His face was priceless - a mix of confusion and delight!",
    image: "/placeholder.svg?height=400&width=600",
    month: "April",
  },
]

type MemoryContextType = {
  memories: Memory[]
  addMemory: (memory: Omit<Memory, "id" | "month">) => void
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export function MemoryProvider({ children }: { children: React.ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>(() => {
    // Try to load from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noahMemories")
      return saved ? JSON.parse(saved) : initialMemories
    }
    return initialMemories
  })

  // Save to localStorage whenever memories change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("noahMemories", JSON.stringify(memories))
    }
  }, [memories])

  const addMemory = (newMemory: Omit<Memory, "id" | "month">) => {
    // Extract month from the date
    const date = new Date(newMemory.date)
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const month = monthNames[date.getMonth()]

    // Format the date for display
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)

    // Create the new memory with an ID and month
    const memoryWithId: Memory = {
      ...newMemory,
      id: Date.now(), // Use timestamp as a simple ID
      month,
      date: formattedDate,
    }

    // Add the new memory and sort chronologically
    setMemories((prev) => {
      const updated = [...prev, memoryWithId]
      return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })
  }

  return <MemoryContext.Provider value={{ memories, addMemory }}>{children}</MemoryContext.Provider>
}

export function useMemories() {
  const context = useContext(MemoryContext)
  if (context === undefined) {
    throw new Error("useMemories must be used within a MemoryProvider")
  }
  return context
}
