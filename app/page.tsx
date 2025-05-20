"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMemories } from "@/lib/memory-context"

export default function Home() {
  const { memories } = useMemories()
  const [latestMemory, setLatestMemory] = useState<(typeof memories)[0] | null>(null)

  // Find the most recent memory for the featured image
  useEffect(() => {
    if (memories.length > 0) {
      // Sort memories by date (newest first) and get the first one
      const sorted = [...memories].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      setLatestMemory(sorted[0])
    }
  }, [memories])

  return (
    <div className="container px-4 py-8 mx-auto max-w-md">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-teal-700">Noah&apos;s First Year</h1>
          <p className="text-muted-foreground">A collection of memories from Noah&apos;s first year</p>
        </div>

        <Card className="overflow-hidden rounded-xl border-2 border-teal-100">
          <CardContent className="p-0">
            <Image
              src={latestMemory?.image || "/placeholder.svg?height=400&width=600"}
              alt={latestMemory?.title || "Noah's favorite recent memory"}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
              priority
            />
            {latestMemory && (
              <div className="p-3 bg-teal-50/80">
                <p className="text-sm font-medium text-teal-700">{latestMemory.title}</p>
                <p className="text-xs text-muted-foreground">{latestMemory.date}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-lg text-center">
            Welcome to Noah&apos;s memory collection! Here you&apos;ll find all the special moments from his first year
            of adventures, milestones, and precious memories.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/timeline" className="block">
              <Button variant="outline" className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
                Timeline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/gallery" className="block">
              <Button
                variant="outline"
                className="w-full bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              >
                Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
