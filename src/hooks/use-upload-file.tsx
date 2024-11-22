import { useState } from "react";
import { toast } from "sonner";

export default function useUploadFile() {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile() {
    if (!selectedFile || !uploadUrl) throw new Error("Error uploading file");
    setIsUploading(true);
    try {
      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
      });
      if (!res.ok) {
        throw new Error("Failed to upload file");
      }
      return { success: true };
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  }

  return {
    setUploadUrl,
    setSelectedFile,
    uploadFile,
    isUploading,
  };
}
