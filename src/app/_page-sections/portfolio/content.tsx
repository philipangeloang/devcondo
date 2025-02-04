import { Button } from "@/app/_components/ui/button";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { IconHandClick } from "@tabler/icons-react";

const Content = () => {
  return (
    <ScrollArea className="col-span-12 sm:h-[calc(100vh-204px)]">
      <div className="grid grid-cols-12 gap-4 rounded-lg">
        <div className="border-skin-base col-span-12 flex flex-col gap-8 rounded-lg border p-4 shadow-md sm:flex-row sm:items-center">
          <div className="bg-skin-fill-accent aspect-square h-48 w-48 rounded-xl"></div>
          <div className="flex flex-col justify-center gap-2">
            <h2 className="text-skin-base text-xl font-bold">About Me</h2>
            <p className="text-skin-muted">
              I&apos;m a Full-Stack Developer with a focus on Frontend. I have 2
              years of expertise in JavaScript and specialize in creating
              engaging user interfaces. I have also worked in Backend and
              developed full-stack applications with React and Flask for 4
              years.
            </p>
          </div>
        </div>

        <div className="border-skin-base col-span-12 flex flex-col gap-4 rounded-lg border p-4 shadow-md md:col-span-6 md:row-span-6">
          <h2 className="text-skin-base text-xl font-bold">My Projects</h2>
          <div className="bg-skin-fill-inverted text-skin-inverted before:from-card-skin-initial after:from-card-skin-final relative flex flex-col gap-4 rounded-lg p-8 before:absolute before:right-[-15px] before:bottom-[-15px] before:-z-20 before:h-[90%] before:w-[90%] before:rounded-lg before:bg-gradient-to-br before:to-transparent before:blur-2xl after:absolute after:right-[-15px] after:bottom-[-15px] after:-z-10 after:h-[90%] after:w-[90%] after:rounded-lg after:bg-gradient-to-br after:to-transparent after:blur-lg">
            <span className="border-skin-base/60 text-skin-inverted/90 max-w-max rounded-md border px-2 py-1 text-xs">
              React JS
            </span>
            <h2 className="text-2xl font-semibold">Project Title</h2>
            <div className="bg-skin-fill h-36 w-full rounded-lg"></div>
            <p className="text-skin-inverted/70 text-sm">
              This is a React JS application which gives you information about
              the food items when a food emoji is given as input. This
              application is free.
            </p>
            <div className="cursor-pointer self-end">
              <IconHandClick />
            </div>
          </div>
          <Button className="bg-skin-fill hover:bg-skin-fill-inverted border-skin-inverted hover:border-skin-base text-skin-base hover:text-skin-inverted w-full cursor-pointer border">
            View All
          </Button>
        </div>

        <div className="border-skin-base col-span-12 flex flex-col gap-4 rounded-lg border p-4 shadow-md sm:col-span-6 md:row-span-5">
          <h2 className="text-skin-base text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            <span className="border-skin-base text-skin-base/70 max-w-max rounded-md border px-2 py-1 text-sm">
              React JS
            </span>
            <span className="border-skin-base text-skin-base/70 max-w-max rounded-md border px-2 py-1 text-sm">
              React JS
            </span>
            <span className="border-skin-base text-skin-base/70 max-w-max rounded-md border px-2 py-1 text-sm">
              React JS
            </span>
            <span className="border-skin-base text-skin-base/70 max-w-max rounded-md border px-2 py-1 text-sm">
              React JS
            </span>
          </div>
        </div>

        <div className="border-skin-base col-span-12 flex flex-col gap-4 rounded-lg border p-4 shadow-md sm:col-span-6 md:row-span-1 md:flex-row md:items-center">
          <h2 className="text-skin-base text-xl font-bold">Resume</h2>
          <div className="bg-skin-fill-inverted text-skin-inverted flex w-full items-center justify-between gap-4 rounded-lg p-4 py-6">
            <span className="text-sm">More details about my career</span>
            <Button className="bg-skin-fill hover:bg-skin-fill/90 text-skin-base w-[50%] cursor-pointer sm:w-28">
              Open
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Content;
