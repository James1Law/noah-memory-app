"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

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
  addMemory: (memory: Omit<Memory, "id" | "month"> & { file: File }) => Promise<void>
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export function MemoryProvider({ children }: { children: React.ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([])

  // Fetch memories from Supabase on mount
  useEffect(() => {
    async function fetchMemories() {
      const { data, error } = await supabase
        .from("memories")
        .select("id, title, date, description, image_url")
        .order("date", { ascending: true })
      if (!error && data) {
        // Map to Memory type and extract month
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ]
        const mapped = data.map((m: any) => {
          const dateObj = new Date(m.date)
          return {
            id: m.id,
            title: m.title,
            date: new Intl.DateTimeFormat("en-US", {
              month: "long", day: "numeric", year: "numeric"
            }).format(dateObj),
            description: m.description,
            image: m.image_url,
            month: monthNames[dateObj.getMonth()],
          }
        })
        setMemories(mapped)
      }
    }
    fetchMemories()
  }, [])

  // Add memory to Supabase (expects file for image)
  const addMemory = async (newMemory: Omit<Memory, "id" | "month"> & { file: File }) => {
    // 1. Upload image to Supabase Storage
    const fileExt = newMemory.file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("noah-photos")
      .upload(fileName, newMemory.file)
    if (uploadError) throw uploadError
    const { data: publicUrlData } = supabase.storage
      .from("noah-photos")
      .getPublicUrl(fileName)
    const imageUrl = publicUrlData.publicUrl

    // Log the data being sent to Supabase
    console.log({
      title: newMemory.title,
      date: newMemory.date,
      description: newMemory.description,
      image_url: imageUrl,
    })

    // 2. Insert memory into Supabase DB
    const { data, error } = await supabase
      .from("memories")
      .insert([
        {
          title: newMemory.title,
          date: newMemory.date,
          description: newMemory.description,
          image_url: imageUrl,
        },
      ])
      .select()
    if (error) throw error
    // 3. Refetch all memories
    const { data: allData } = await supabase
      .from("memories")
      .select("id, title, date, description, image_url")
      .order("date", { ascending: true })
    if (allData) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      const mapped = allData.map((m: any) => {
        const dateObj = new Date(m.date)
        return {
          id: m.id,
          title: m.title,
          date: new Intl.DateTimeFormat("en-US", {
            month: "long", day: "numeric", year: "numeric"
          }).format(dateObj),
          description: m.description,
          image: m.image_url,
          month: monthNames[dateObj.getMonth()],
        }
      })
      setMemories(mapped)
    }
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
