"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, CheckCircle2, FileVideo, UploadCloud, X } from "lucide-react"

type UploadStatus = "idle" | "uploading" | "success" | "error"

export default function VideoUploader() {
  // Form State
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  
  // Upload Status State
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      // Ensure it's a video file
      if (!selectedFile.type.startsWith("video/")) {
        setErrorMessage("Please select a valid video file (MP4, WebM, etc.).")
        setStatus("error")
        return
      }
      setFile(selectedFile)
      setStatus("idle")
      setErrorMessage("")
    }
  }

  // Clear selected file
  const resetForm = () => {
    setFile(null)
    setTitle("")
    setDescription("")
    setStatus("idle")
    setProgress(0)
    setErrorMessage("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Simulated Upload Logic
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !description) return

    setStatus("uploading")
    setProgress(0)
    setErrorMessage("")

    // Simulate network chunk uploading
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 15
      
      if (currentProgress <= 90) {
        setProgress(currentProgress)
      } else {
        clearInterval(interval)
        
      }
    }, 400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Video</CardTitle>
          <CardDescription>
            Add your video details and upload it to the platform.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleUpload}>
          <CardContent className="space-y-6">
            
            {/* 1. File Drop / Select Area */}
            <div className="space-y-2">
              <Label htmlFor="video-file">Video File</Label>
              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-background/50"
                >
                  <UploadCloud className="w-10 h-10 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    Click to select a video file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, WebM or OGG (MAX. 500MB)
                  </p>
                  <Input
                    ref={fileInputRef}
                    id="video-file"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={status === "uploading"}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileVideo className="w-6 h-6 text-primary" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {status !== "uploading" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* 2. Metadata Inputs */}
            <div className="space-y-2">
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                placeholder="Title of your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={status === "uploading"}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="write a description of your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={status === "uploading"}
                required
              />
            </div>

            {/* 3. Progress Bar (Visible only when uploading) */}
            {status === "uploading" && (
              <div className="space-y-2 pt-2 animate-in fade-in-50">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Uploading to server...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 w-full" />
              </div>
            )}

            {/* 4. Error Message Banner */}
            {status === "error" && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive animate-in fade-in-50">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Upload Failed</p>
                  <p className="text-xs opacity-90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* 5. Success Message Banner */}
            {status === "success" && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-600 dark:text-green-400 animate-in fade-in-50">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">Upload Complete!</p>
                  <p className="text-xs opacity-90">Your video is now ready to be viewed.</p>
                </div>
              </div>
            )}

          </CardContent>

          <CardFooter className="flex justify-end gap-2 bg-muted/20 py-3 px-6 border-t">
            {status === "success" ? (
              <Button type="button" onClick={resetForm} className="w-full">
                Upload Another Video
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={!file && status === "idle"}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={!file || !title || !description || status === "uploading"}
                >
                  {status === "uploading" ? "Uploading..." : status === "error" ? "Retry Upload" : "Start Upload"}
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}