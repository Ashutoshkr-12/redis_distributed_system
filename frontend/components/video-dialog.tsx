"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription} from "@/components/ui/dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface CustomDialogProps {
  open: boolean
  onChange: (open: boolean) => void
}

export default function VideoDialog({ open, onChange }: CustomDialogProps) {


  return (
    <Dialog  open={open} onOpenChange={onChange}>
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
          <CardHeader className="flex flex-row items-center gap-3 px-0 py-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={"#"} alt="img" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                a
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">
                first video
              </span>
              
            </div>
          </CardHeader>

          {/* Video Player Section */}
          <CardContent className="px-0 pb-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video
                src={'#'}
                controls
                className="h-full w-full object-contain"
                poster="/placeholder-video-poster.jpg" // Optional loading image
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>

          {/* Video Title and Description */}
          <CardFooter className="flex flex-col items-start px-0 pb-0">
            <h3 className="font-bold text-lg leading-none mb-2">
              first
            </h3>
           alls et
          </CardFooter>
          
        </Card>
      </DialogContent>
    </Dialog>
  );
}