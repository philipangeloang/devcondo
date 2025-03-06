import React from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";

const SkillLoader = () => {
  return (
    <div className="space-y-8">
      {/* Skills Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Icon */}
              <div className="space-y-1">
                <Skeleton className="h-5 w-24" /> {/* Skill Name */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" /> {/* Status Badge */}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" /> {/* Toggle Button */}
              <Skeleton className="h-9 w-9" /> {/* Delete Button */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillLoader;
