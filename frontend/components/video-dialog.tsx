"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";


interface CustomDialogProps {
  open: boolean;
  onChange: (open: boolean) => void;
}
interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  originalVideo: string;
  compressedVideo?: string;
  status: string;
}

interface CustomDialogProps {
  open: boolean;
  onChange: (open: boolean) => void;
  video: Video | null;
}

export default function VideoDialog({
  open,
  onChange,
  video,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="max-w-3xl p-6">
        <DialogHeader>
          <DialogTitle>Video Preview</DialogTitle>
          <DialogDescription>
            Watch the uploaded clip and details below.
          </DialogDescription>
        </DialogHeader>

        {/* Card containing the uploader info and video player */}
        <Card className="overflow-hidden border-none shadow-none">
          {/* Uploader Info Section */}
          {/* <CardHeader className="flex flex-row items-center gap-3 px-0 py-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={"#"} alt="img" />
              <AvatarFallback>
  {video?.title.charAt(0)}
</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">
                first video
              </span>
              
            </div>
          </CardHeader> */}

          {/* Video Player Section */}
          <CardContent className="px-0 pb-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video
                src={video?.compressedVideo || video?.originalVideo}
                controls
                poster={video?.thumbnail}
                className="w-full h-full object-contain"
              />
            </div>
          </CardContent>

          {/* Video Title and Description */}
          <CardFooter className="flex flex-col items-start px-4 pb-0">
            <h3 className="text-xl font-semibold">
              <span className="text-gray-800">Title: </span>
              {video?.title}
            </h3>
            <p className="text-xl font-semibold">
              <span className="text-gray-800">Description: </span>
              {video?.description}
            </p>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
