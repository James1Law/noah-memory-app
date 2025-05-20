"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useMemories } from "@/lib/memory-context"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { addMemory } = useMemories()

  // In a real app, this would be a secure password check against a database or environment variable
  const correctPassword = "noah123"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (password === correctPassword) {
        setIsAuthenticated(true)
        toast({
          title: "Success",
          description: "You are now logged in to the admin panel.",
        })
      } else {
        toast({
          title: "Authentication failed",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !description || !imagePreview) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and add an image.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Add the new memory
    addMemory({
      title,
      date,
      description,
      image: imagePreview || "/placeholder.svg?height=400&width=600",
    })

    // Show success message
    toast({
      title: "Memory added",
      description: "The new memory has been successfully added to Noah's timeline and gallery.",
    })

    // Reset the form
    setTitle("")
    setDate("")
    setDescription("")
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setIsLoading(false)

    // Navigate to timeline to see the new memory
    setTimeout(() => {
      router.push("/timeline")
    }, 1500)
  }

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-md flex items-center justify-center min-h-[80vh]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-teal-700">Admin Access</CardTitle>
            <CardDescription>Enter the password to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Checking..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-teal-700 text-center">Add New Memory</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="First steps, First word, etc."
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  required
                  className="pl-10"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this special moment..."
                className="min-h-[100px]"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-md"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground/75">JPG, PNG or GIF (max. 5MB)</p>
                  </>
                )}
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Memory"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
