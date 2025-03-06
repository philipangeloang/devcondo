import React from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";

const ResumeLoader = () => {
  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="w-64 shrink-0 space-y-2 rounded-lg bg-gray-100 p-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 p-2">
            <Skeleton className="h-4 w-4" /> {/* Icon */}
            <Skeleton className="h-4 w-24" /> {/* Tab Text */}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-8 p-8">
        {/* Basic Details Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" /> {/* Section Title */}
            <Skeleton className="h-4 w-72" /> {/* Description */}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-5 w-24" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeLoader;
