"use client";
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { type DropzoneProps, useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { Upload } from "lucide-react";

type AvatarUploaderProps = {
  defaultImg?: string;
  maxSize?: DropzoneProps["maxSize"];
};
export default function AvatarUploader({
  defaultImg = "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png",
  maxSize = 4 * 1024 * 1024,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const form = useFormContext();
  if (!form)
    throw new Error("Component must be used inside a react-hook-form context");
  const { setValue } = form;

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file) throw new Error("No file selected");
      const reader = new FileReader();
      reader.onload = async (e) => {
        setPreview(e.target?.result as string);
        setValue("imageFile", file);
        setValue("image", true);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    maxSize,
  });

  return (
    <Avatar
      {...getRootProps()}
      className="group mx-auto h-40 w-40 before:absolute before:inset-0 before:bg-black/70 before:opacity-0 before:transition-opacity hover:before:opacity-100 focus:before:opacity-100"
    >
      <Upload
        size={42}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
      />
      <input {...getInputProps()} />
      <AvatarImage src={preview ?? defaultImg} alt="Avatar Preview" />
    </Avatar>
  );
}
