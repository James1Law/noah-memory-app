"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMemories } from "@/lib/memory-context"

export default function Timeline() {
  const { memories } = useMemories()

  // Group memories by month
  const groupedMemories = memories.reduce(
    (acc, memory) => {
      if (!acc[memory.month]) {
        acc[memory.month] = []
      }
      acc[memory.month].push(memory)
      return acc
    },
    {} as Record<string, typeof memories>,
  )

  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>(() => {
    // Start with the most recent month expanded
    const months = Object.keys(groupedMemories)
    const initial: Record<string, boolean> = {}
    if (months.length > 0) {
      initial[months[months.length - 1]] = true
    }
    return initial
  })

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }))
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-teal-700 text-center">Noah&apos;s Timeline</h1>

      <div className="space-y-6">
        {Object.entries(groupedMemories).map(([month, monthMemories]) => (
          <div key={month} className="space-y-4">
            <div
              className="flex items-center justify-between bg-teal-50 p-3 rounded-lg cursor-pointer"
              onClick={() => toggleMonth(month)}
            >
              <h2 className="text-xl font-semibold text-teal-700">{month}</h2>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                {expandedMonths[month] ? (
                  <ChevronUp className="h-5 w-5 text-teal-700" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-teal-700" />
                )}
              </Button>
            </div>

            <div
              className={cn(
                "space-y-4 transition-all duration-500 overflow-hidden",
                expandedMonths[month] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
              )}
            >
              {monthMemories.map((memory) => (
                <Card key={memory.id} className="overflow-hidden border-2 border-teal-100 rounded-xl animate-fadeIn">
                  <CardHeader className="pb-2">
                    <div className="text-sm text-muted-foreground">{memory.date}</div>
                    <CardTitle className="text-xl text-teal-700">{memory.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Image
                      src={memory.image || "/placeholder.svg"}
                      alt={memory.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <p className="text-muted-foreground">{memory.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
