const BACKEND_URL = process.env.BACKEND_URI!

export interface VideoRecord {
  _id: string;
  title: string;
  description?: string;
  originalVideo?: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export interface UploadVideoResponse {
  success: boolean;
  message?: string;
  video: VideoRecord;
}

export interface VideoStatusResponse {
  success: boolean;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  video?: VideoRecord;
}

// export const uploadVideo = async (formData: FormData): Promise<UploadVideoResponse> => {
//   const res = await fetch(`http://localhost:8000/api/upload-video`, {
//     method: "POST",
//     // headers: {
//     //   "Content-Type": "application/json"
//     // },
//     body: formData,
//   });

//   if (!res.ok) {
//     const errorData = await res.json().catch(() => null);
//     throw new Error(errorData?.message || `Upload failed with status: ${res.status}`);
//   }

//   return await res.json();
// };


export const getVideoStatus = async (videoId: string): Promise<VideoStatusResponse> => {
  const res = await fetch(`${BACKEND_URL}/videos/${videoId}/status`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
    cache: "no-store", 
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    return (errorData?.message || `Failed to fetch video status: ${res.status}`);
  }

  return await res.json();
};