import { Skeleton } from "@/app/_components/ui/skeleton";

const PortfolioLoader = () => {
  return (
    <>
      <div className="border-skin-base col-span-12 flex flex-col justify-between rounded-lg border p-8 shadow-md sm:col-span-6 sm:h-[calc(100vh-204px)]">
        <div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-36 w-36 rounded-lg" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div className="mt-9">
            <Skeleton className="mb-3 h-7 w-40" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 border-t pt-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 sm:h-[calc(100vh-204px)]">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-4 rounded-lg bg-gray-100 p-8 dark:bg-gray-800"
            >
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PortfolioLoader;
