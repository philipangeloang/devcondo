import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import { useUploadThing } from "@/utils/uploadthing";
import { useCallback, useEffect } from "react";
import { IconPhoto } from "@tabler/icons-react";
import Image from "next/image";

interface ProfileUploader {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  fetchedImage?: string;
}

export function ProfileUploader({
  files,
  onFilesChange,
  disabled = false,
  fetchedImage,
}: ProfileUploader) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesChange(acceptedFiles);
    },
    [onFilesChange],
  );

  const { routeConfig } = useUploadThing("imageUploader");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
    disabled,
    maxFiles: 1,
  });

  // Create URL for preview safely
  const previewUrl = files[0] ? URL.createObjectURL(files[0]) : null;

  // Cleanup preview URL when component unmounts or files change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        disabled
          ? "border-muted bg-muted/50 cursor-not-allowed"
          : "hover:border-primary/50 cursor-pointer"
      }`}
    >
      {disabled && (
        <div className="bg-background/50 absolute inset-0 z-50 rounded-lg" />
      )}
      <input {...getInputProps()} />
      <div className="space-y-4">
        {/* If there is a file uploaded render this below */}
        {files.length > 0 && previewUrl ? (
          <>
            <div className="border-muted mx-auto h-32 w-32 overflow-hidden rounded-full border-2">
              <Image
                src={previewUrl}
                alt="Profile preview"
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-muted-foreground text-sm">
              <p className="font-medium">
                {files[0] ? files[0].name : "Selected image"}
              </p>
              <p>
                {files[0]
                  ? `${(files[0].size / (1024 * 1024)).toFixed(2)} MB`
                  : ""}
              </p>
            </div>
          </>
        ) : // If there is a fetched image render this below
        fetchedImage ? ( //There is a fetched image
          <>
            <div className="border-muted mx-auto h-32 w-32 overflow-hidden rounded-full border-2">
              <Image
                src={fetchedImage}
                alt="Current profile image"
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-muted-foreground text-sm">
              <p className="font-medium">Current profile image</p>
              <div
                className={`text-sm ${disabled ? "text-muted-foreground/50" : "text-muted-foreground"}`}
              >
                <p>Drop or select a new image to change</p>
                <p>SVG, PNG, JPG (max. 2MB)</p>
              </div>
            </div>
          </>
        ) : (
          // If there is no file uploaded or fetched image render this below
          <>
            <div className="bg-muted mx-auto flex h-32 w-32 items-center justify-center rounded-full">
              <IconPhoto
                size={72}
                stroke={1}
                className={
                  disabled
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground"
                }
              />
            </div>
            <div
              className={`text-sm ${disabled ? "text-muted-foreground/50" : "text-muted-foreground"}`}
            >
              <p className="font-medium">
                Drop your profile image here or click to select
              </p>
              <p>SVG, PNG, JPG (max. 2MB)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
