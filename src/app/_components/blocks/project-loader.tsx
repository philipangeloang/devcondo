import React from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";

const ProjectLoader = () => {
  return (
    <div className="space-y-8">
      {/* Table Header */}

      {/* Project Table/List */}
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start justify-between rounded-lg border border-gray-100 p-6"
          >
            <div className="w-full space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-6 w-48" /> {/* Project Title */}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9" /> {/* Edit Button */}
                  <Skeleton className="h-9 w-9" /> {/* Delete Button */}
                </div>
              </div>
              <Skeleton className="h-24 w-full" /> {/* Project Image */}
              <Skeleton className="h-20 w-full" /> {/* Description */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20" /> /* Skills */
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectLoader;
