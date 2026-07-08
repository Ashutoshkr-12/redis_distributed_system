"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  X,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

type VideoStatus =
  | "IDLE"
  | "UPLOADING"
  | "QUEUED"
  | "DOWNLOADING"
  | "GENERATING_THUMBNAIL"
  | "UPLOADING_THUMBNAIL"
  | "COMPLETED"
  | "FAILED";

interface Video {
  _id: string;

  title: string;

  status: VideoStatus;

  thumbnail?: string;

  originalVideo?: string;

  compressedVideo?: string;

  failureReason?: string;
}

const processingSteps = [
  "QUEUED",
  "DOWNLOADING",
  "GENERATING_THUMBNAIL",
  "UPLOADING_THUMBNAIL",
  "COMPLETED",
];

export default function VideoUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [video, setVideo] = useState<Video | null>(null);
  const [uiStatus, setUiStatus] = useState<VideoStatus>("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!file) return;
  try {
    setUiStatus("UPLOADING");
    setErrorMessage("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append(
      "description",
      description
    );
    
    formData.append("video", file);
    const response = await fetch(
      `http://localhost:8000/api/upload-video`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData =
        await response.json();

      throw new Error(
        errorData.message ||
          "Upload failed"
      );
    }

    const data = await response.json();

    // console.log("UPLOAD DATA:", data);

    setUploadProgress(100);

    setVideo(data.video);

    setUiStatus("QUEUED");
  } catch (error: any) {
    console.log(
      "UPLOAD ERROR:",
      error
    );

    setUiStatus("FAILED");

    setErrorMessage(
      error.message ||
        "Upload failed"
    );
  }
};


  useEffect(() => {
    if (!video?._id) return;

    if (video.status === "COMPLETED" || video.status === "FAILED") {
      return;
    }

pollingRef.current = setInterval(
  async () => {
    try {
      const response =
        await fetch(
          `http://localhost:8000/api/video/${video._id}`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch status"
        );
      }

      const data =
        await response.json();

      const updatedVideo =
        data.video;

      console.log(
        "UPDATED VIDEO:",
        updatedVideo
      );

      setVideo(updatedVideo);

      setUiStatus(
        updatedVideo.status
      );

      if (
        updatedVideo.status ===
          "COMPLETED" ||
        updatedVideo.status ===
          "FAILED"
      ) {
        if (pollingRef.current) {
          clearInterval(
            pollingRef.current
          );
        }
      }
    } catch (error) {
      console.log(
        "POLLING ERROR:",
        error
      );
    }
  },

  3000
);


    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [video?._id, video?.status]);

  const resetForm = () => {
    setFile(null);

    setTitle("");

    setDescription("");

    setVideo(null);

    setUiStatus("IDLE");

    setUploadProgress(0);

    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  };

  const isDisabled =
    uiStatus !== "IDLE" && uiStatus !== "FAILED" && uiStatus !== "COMPLETED";

  const progressValue =
    uiStatus === "QUEUED"
      ? 20
      : uiStatus === "DOWNLOADING"
        ? 40
        : uiStatus === "GENERATING_THUMBNAIL"
          ? 70
          : uiStatus === "UPLOADING_THUMBNAIL"
            ? 90
            : uiStatus === "COMPLETED"
              ? 100
              : uploadProgress;

 return (
  <div className="min-h-screen bg-muted/40">
    {/* Header */}
    <header className="h-20 px-8 flex items-center justify-end border-b bg-background">
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: {
              width: "40px",
              height: "40px",
            },
          },
        }}
      />
    </header>

    {/* Main */}
    <main className="flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Distributed Video Processing</CardTitle>

          <CardDescription>
            Upload video and process it asynchronously using Redis + BullMQ
            workers.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleUpload}>
          <CardContent className="space-y-6">
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
              >
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-3" />

                <p className="font-medium">Click to upload video</p>

                <p className="text-sm text-muted-foreground">MP4, MOV, WEBM</p>

                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];

                    if (selected) {
                      setFile(selected);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileVideo className="w-8 h-8 text-primary" />

                  <div>
                    <p className="font-medium">{file.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {!isDisabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Title</Label>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>

              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDisabled}
              />
            </div>

            {uiStatus !== "IDLE" && uiStatus !== "FAILED" && (
              <div className="space-y-3">
                <Progress value={progressValue} />

                <div className="text-sm text-muted-foreground">
                  {uiStatus === "UPLOADING" && "Uploading video..."}

                  {uiStatus === "QUEUED" && "Waiting for worker..."}

                  {uiStatus === "DOWNLOADING" && "Worker downloading video..."}

                  {uiStatus === "GENERATING_THUMBNAIL" &&
                    "Generating thumbnail..."}

                  {uiStatus === "UPLOADING_THUMBNAIL" &&
                    "Uploading thumbnail..."}

                  {uiStatus === "COMPLETED" && "Video processing completed"}
                </div>
              </div>
            )}

            {(uiStatus === "QUEUED" ||
              uiStatus === "DOWNLOADING" ||
              uiStatus === "GENERATING_THUMBNAIL" ||
              uiStatus === "UPLOADING_THUMBNAIL") && (
              <div className="border rounded-lg p-4 space-y-3">
                {processingSteps.map((step) => {
                  const completed =
                    processingSteps.indexOf(video?.status || "") >
                    processingSteps.indexOf(step);

                  const active = video?.status === step;

                  return (
                    <div key={step} className="flex items-center gap-3">
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : (
                        <div className="w-4 h-4 border rounded-full" />
                      )}

                      <span className="text-sm">
                        {step.replaceAll("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {uiStatus === "FAILED" && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />

                <div>
                  <p className="font-medium text-red-500">Processing Failed</p>

                  <p className="text-sm text-muted-foreground">
                    {errorMessage || video?.failureReason}
                  </p>
                </div>
              </div>
            )}

            {uiStatus === "COMPLETED" && video && (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />

                  <div>
                    <p className="font-medium text-green-500">
                      Video Processed
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Thumbnail generated successfully.
                    </p>
                  </div>
                </div>

                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt="thumbnail"
                    className="rounded-lg border"
                  />
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t py-4">
            {(uiStatus === "COMPLETED" || uiStatus === "FAILED") && (
              <Button type="button" onClick={resetForm}>
                Upload Another
              </Button>
            )}

            {(uiStatus === "IDLE" || uiStatus === "UPLOADING") && (
              <Button
                type="submit"
                disabled={
                  !file || !title || !description || uiStatus === "UPLOADING"
                }
              >
                {uiStatus === "UPLOADING" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}

                {uiStatus === "UPLOADING" ? "Uploading..." : "Upload Video"}
              </Button>
            )}

          <Link href={'/videos'}>
          <Button>
        GO TO VIDEOS
      </Button>
          </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  </div>
);
}

