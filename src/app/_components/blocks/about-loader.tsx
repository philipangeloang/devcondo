import React from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";

const AboutLoader = () => {
  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-12" /> {/* Label */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
      </div>

      {/* Title Field */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* Label */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-8" /> {/* Label */}
        <Skeleton className="h-24 w-full" /> {/* Textarea */}
        <Skeleton className="h-4 w-72" /> {/* Description */}
      </div>

      {/* Profile Image Field */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* Label */}
        <div className="flex items-center justify-center">
          <Skeleton className="h-64 w-full" /> {/* Image Preview */}
        </div>
      </div>

      {/* Social Media Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" /> {/* Section Title */}
          <Skeleton className="h-4 w-72" /> {/* Section Description */}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Social Media Fields */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-5 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export default AboutLoader;
