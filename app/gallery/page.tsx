"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useMemories } from "@/lib/memory-context"

export default function Gallery() {
  const { memories } = useMemories()
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof memories)[0] | null>(null)

  // Extract photos from memories for the gallery
  const photos = memories.map((memory) => ({
    id: memory.id,
    src: memory.image,
    alt: memory.title,
    date: memory.date,
  }))

  return (
    <div className="container px-4 py-8 mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-teal-700 text-center">Noah&apos;s Gallery</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square overflow-hidden rounded-xl border-2 border-teal-100 cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              width={300}
              height={300}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {selectedPhoto && (
              <div className="bg-white p-4 rounded-xl">
                <Image
                  src={selectedPhoto.src || "/placeholder.svg"}
                  alt={selectedPhoto.alt}
                  width={600}
                  height={600}
                  className="w-full max-h-[70vh] object-contain rounded-md"
                />
                <div className="mt-2 text-center">
                  <p className="font-medium">{selectedPhoto.alt}</p>
                  <p className="text-sm text-muted-foreground">{selectedPhoto.date}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
