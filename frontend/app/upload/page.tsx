"use client"

import { useState, useRef, useEffect } from "react"
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
import { AlertCircle, CheckCircle2, FileVideo, UploadCloud, X, Loader2 } from "lucide-react"
import { uploadVideo, getVideoStatus } from "@/lib/api/video.api"

type UploadStatus = "idle" | "uploading" | "queued" | "processing" | "success" | "error"

interface VideoJobState {
  id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export default function VideoUploader() {
  // Form State
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  
  // Upload & Queue Status State
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [activeJob, setActiveJob] = useState<VideoJobState | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
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

  // Clear selected file & reset state
  const resetForm = () => {
    setFile(null)
    setTitle("")
    setDescription("")
    setStatus("idle")
    setProgress(0)
    setErrorMessage("")
    setActiveJob(null)
    if (pollingRef.current) clearInterval(pollingRef.current)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Polling Effect for Background Worker Consistency
  useEffect(() => {
    if (!activeJob || activeJob.status === "COMPLETED" || activeJob.status === "FAILED") {
      if (pollingRef.current) clearInterval(pollingRef.current)
      return
    }

    pollingRef.current = setInterval(async () => {
      try {
        // Fetch current status from backend database
        const res = await getVideoStatus(activeJob.id)
        const currentDbStatus = res.data.status

        setActiveJob((prev) => prev ? { ...prev, status: currentDbStatus } : null)

        if (currentDbStatus === "PROCESSING") setStatus("processing")
        if (currentDbStatus === "COMPLETED") {
          setStatus("success")
          if (pollingRef.current) clearInterval(pollingRef.current)
        }
        if (currentDbStatus === "FAILED") {
          setStatus("error")
          setErrorMessage("Background video processing failed during transcoding.")
          if (pollingRef.current) clearInterval(pollingRef.current)
        }
      } catch (err) {
        console.error("Failed to sync status with server:", err)
      }
    }, 3000) 

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [activeJob?.id, activeJob?.status])

  // Real Network Upload Logic
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !description) return

    // 1. Immediately lock UI and set loading state
    setStatus("uploading")
    setProgress(0)
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description) // Fixed: Attaching text, not binary file
      formData.append("file", file) // Ensure key matches your backend multer/streamifier config

      // 2. Call upload API (uploadVideo accepts a single argument)
      const response = await uploadVideo(formData)
      // Ensure progress shows complete on finish
      setProgress(100)

      // 3. Upload complete, transition to background queue synchronization
      const uploadResult = response as unknown as {
        video?: { _id: string }
        data?: { video?: { _id: string } }
      }
      const createdVideo = uploadResult.video || uploadResult.data?.video
      if (createdVideo) {
        setActiveJob({ id: createdVideo._id, status: "QUEUED" })
        setStatus("queued")
      } else {
        setStatus("success")
      }

    } catch (error: any) {
      console.error("Upload Error:", error)
      setStatus("error")
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        "Failed to upload video to server."
      )
    }
  }

  const isFormDisabled = status === "uploading" || status === "queued" || status === "processing"

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
                    disabled={isFormDisabled}
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
                  {!isFormDisabled && (
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
                disabled={isFormDisabled}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Write a description of your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isFormDisabled}
                required
              />
            </div>

            {/* 3. Real-Time Network Progress Bar */}
            {status === "uploading" && (
              <div className="space-y-2 pt-2 animate-in fade-in-50">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Uploading to server...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 w-full" />
              </div>
            )}

            {/* 4. Background Queue Processing States */}
            {(status === "queued" || status === "processing") && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3 text-blue-600 dark:text-blue-400 animate-in fade-in-50">
                <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
                <div className="text-sm">
                  <p className="font-semibold capitalize">
                    {status === "queued" ? "In Queue..." : "Processing Video..."}
                  </p>
                  <p className="text-xs opacity-90">
                    {status === "queued" 
                      ? "Your video is waiting for an available worker." 
                      : "Transcoding and generating optimized streaming formats."}
                  </p>
                </div>
              </div>
            )}

            {/* 5. Error Message Banner */}
            {status === "error" && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive animate-in fade-in-50">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Upload Failed</p>
                  <p className="text-xs opacity-90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* 6. Success Message Banner */}
            {status === "success" && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-600 dark:text-green-400 animate-in fade-in-50">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">Upload Complete!</p>
                  <p className="text-xs opacity-90">Your video has been processed and is ready to view.</p>
                </div>
              </div>
            )}

          </CardContent>

          <CardFooter className="flex justify-end gap-2 bg-muted/20 py-3 px-6 border-t">
            {status === "success" || status === "error" ? (
              <Button type="button" onClick={resetForm} className="w-full">
                {status === "error" ? "Try Again" : "Upload Another Video"}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isFormDisabled || (!file && status === "idle")}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={!file || !title || !description || isFormDisabled}
                >
                  {status === "uploading" 
                    ? "Uploading..." 
                    : status === "queued" || status === "processing" 
                    ? "Processing..." 
                    : "Start Upload"}
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}