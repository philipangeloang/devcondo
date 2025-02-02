import { Button } from "@/app/_components/ui/button";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

const projects = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  title: `Project Title ${index + 1}`,
  description:
    "This is a React JS application which gives you information about the food items when a food emoji is given as input. This application is free.",
  tech: "React JS",
}));
const Content = () => {
  return (
    <>
      <div className="border-skin-base col-span-12 flex flex-col justify-end rounded-lg border p-8 shadow-md sm:col-span-6 sm:h-[calc(100vh-204px)]">
        <div className="flex flex-col gap-8 text-center sm:text-left md:pr-16">
          <h1 className="text-2xl font-semibold">
            Over the past few years, I&apos;ve worked on various projects.
            Here&apos;s few of my best
          </h1>
          <Button className="bg-skin-button-muted text-skin-inverted cursor-pointer sm:w-[150px]">
            Get in touch
          </Button>
        </div>
      </div>

      <ScrollArea className="col-span-12 sm:col-span-6 sm:h-[calc(100vh-204px)]">
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="text-skin-base relative flex flex-col gap-4 rounded-lg bg-gray-200 p-8"
            >
              <span className="border-skin-base text-skin-base/70 max-w-max rounded-md border px-2 py-1 text-xs">
                {project.tech}
              </span>
              <h2 className="text-2xl font-semibold">{project.title}</h2>
              <div className="bg-skin-fill-accent h-32 w-full"></div>
              <p className="text-skin-muted text-sm">{project.description}</p>
              <Button className="w-[150px] cursor-pointer">View Project</Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default Content;
