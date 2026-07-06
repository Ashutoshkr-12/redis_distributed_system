const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URI || process.env.BACKEND_URI!;

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


export const uploadVideo = async (formData: FormData): Promise<UploadVideoResponse> => {
  const res = await fetch(`${BACKEND_URL}/upload-video`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Upload failed with status: ${res.status}`);
  }

  return await res.json();
};


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
    throw new Error(errorData?.message || `Failed to fetch video status: ${res.status}`);
  }

  return await res.json();
};