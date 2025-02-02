import { Button } from "@/app/_components/ui/button";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

const projects = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  title: `Project Title ${index + 1}`,
  description:
    "This is a React JS application which gives you information about the food items when a food emoji is given as input. This application is free.",
  tech: "React JS",
}));

const Projects = () => {
  return (
    <main className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-4 p-4">
      <div className="border-skin-base bg-skin-fill col-span-12 flex w-full items-center justify-between rounded-lg border p-4">
        <h3 className="text-2xl font-bold">Philip</h3>
        <ul className="flex gap-8">
          <li>Home</li>
          <li>Projects</li>
          <li>Resume</li>
        </ul>
        <div className="flex gap-2">
          <IconBrandX
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
          <IconBrandInstagram
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
          <IconBrandGithub
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
          <IconBrandLinkedin
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </div>
      </div>

      <div className="border-skin-base col-span-6 flex h-[calc(100vh-118px)] flex-col justify-between rounded-lg border p-8">
        <p className="opacity-0">Push below</p>
        <div className="flex flex-col gap-8 pr-16">
          <h1 className="text-2xl font-semibold">
            Over the past few years, I&apos;ve worked on various projects.
            Here&apos;s few of my best
          </h1>
          <Button className="bg-skin-button-muted text-skin-inverted w-[150px] cursor-pointer">
            Get in touch
          </Button>
        </div>
      </div>

      <ScrollArea className="col-span-6 h-[calc(100vh-118px)]">
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
    </main>
  );
};

export default Projects;
