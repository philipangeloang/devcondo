"use client";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { Badge } from "@/app/_components/ui/badge";
import { usePathname } from "next/navigation";
import { api } from "@/trpc/react";
import Link from "next/link";
import {
  IconFileText,
  IconChevronRight,
  IconExternalLink,
} from "@tabler/icons-react";
import PortfolioLoader from "@/app/_components/blocks/portfolio-loader";

interface Skill {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  isActive: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  projectUrl: string | null;
  imageUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
  skills: Array<{
    projectId: number;
    skillId: number;
    skill: Skill;
  }>;
}

const Content = () => {
  const pathname = usePathname();
  const { data: aboutInfo, isLoading: aboutInfoLoading } =
    api.aboutInfo.get.useQuery();
  const { data: skills, isLoading: skillsLoading } =
    api.skill.getActive.useQuery();
  const { data: projects, isLoading: projectsLoading } =
    api.project.getProjectsWithSkills.useQuery();

  if (aboutInfoLoading || skillsLoading || projectsLoading) {
    return <PortfolioLoader />;
  }

  return (
    <>
      <div className="border-skin-base col-span-12 flex flex-col justify-between rounded-lg border p-8 shadow-md sm:col-span-6 sm:h-[calc(100vh-204px)]">
        <div>
          <div className="flex flex-col gap-3">
            <div className="bg-skin-fill-accent h-36 w-36 rounded-lg" />
            <h1 className="text-2xl font-semibold">{aboutInfo?.title}</h1>
            <p className="text-skin-muted text-sm">{aboutInfo?.bio}</p>
          </div>
          <div className="mt-9">
            <h3 className="mb-3 text-lg font-bold">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {skills?.map((skill: Skill) => (
                <Badge key={skill.id}>{skill.name}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 border-t pt-6">
            <div className="rounded-full bg-gradient-to-r from-black to-gray-500 p-2">
              <IconFileText className="h-6 w-6 text-white" stroke={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-skin-muted text-sm">
                Ready to learn more?
              </span>
              <Link
                href={`${pathname}/resume`}
                className="group flex items-center gap-1 text-base font-medium transition-colors hover:opacity-80 dark:hover:opacity-80"
              >
                View my resume
                <IconChevronRight
                  className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
                  stroke={2}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="col-span-12 sm:col-span-6 sm:h-[calc(100vh-204px)]">
        <div className="flex flex-col gap-4">
          {projects?.map((project: Project) => (
            <div
              key={project.id}
              className="text-skin-base relative flex flex-col gap-4 rounded-lg bg-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{project.title}</h2>
                <a href={project?.projectUrl ?? ""} target="_blank">
                  <IconExternalLink className="cursor-pointer" />
                </a>
              </div>
              <div className="bg-skin-fill-accent h-32 w-full"></div>
              <p className="text-skin-muted text-sm">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.skills?.map((p) => (
                  <Badge
                    key={p.skill.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {p.skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default Content;
