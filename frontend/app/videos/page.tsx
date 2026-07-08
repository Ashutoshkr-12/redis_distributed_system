"use client";

import { useEffect, useState } from "react";
import VideoDialog from "@/components/video-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  originalVideo: string;
  compressedVideo?: string;
  status: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      // console.log(process.env.BACKEND_URI)
      const response = await fetch(
        `http://localhost:8000/api/video/all`
      );

      const data = await response.json();

      setVideos(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  // console.log(videos)

  return (
    <>
    <div className="w-full h-24 px-6 flex items-center justify-end border-b ">

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
        </div>
        {videos?.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.map((video) => (
          <Card
            key={video._id}
            className="relative overflow-hidden"
          >
            <img
              src={video.thumbnail}
              className="aspect-video w-full object-cover"
            />

            <CardHeader>
              <CardAction>
                <Badge>{video.status}</Badge>
              </CardAction>

              <CardTitle>{video.title}</CardTitle>

              <CardDescription>
                {video.description}
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  setSelectedVideo(video);
                  setIsOpen(true);
                }}
              >
                Watch
              </Button>
            </CardFooter>
          </Card>
        ))}
         </div>
        : <>
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold"> No videos available</h1>
        </div>
        </>}
      

      <VideoDialog
        open={isOpen}
        onChange={setIsOpen}
        video={selectedVideo}
      />
    </>
  );
}