import { Button } from "@/app/_components/ui/button";
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
    <main className="relative mx-auto w-full max-w-5xl gap-4 p-4">
      <div className="border-skin-base bg-skin-fill sticky top-4 z-40 flex w-full items-center justify-between rounded-lg border p-4">
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

      <div className="relative flex min-h-screen gap-4">
        {/* Sticky Left Container */}
        <div className="border-skin-base sticky top-[102px] flex h-[calc(100vh-118px)] w-[50%] flex-col justify-between rounded-lg border p-8">
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

        {/* Scrollable Right Content */}
        <div className="mt-[16px] flex flex-1 flex-col gap-4">
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
      </div>
    </main>
  );
};

export default Projects;
