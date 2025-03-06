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
import Image from "next/image";

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
      <div className="border-skin-base col-span-12 flex flex-col justify-between rounded-lg border-2 p-8 shadow-md sm:col-span-6 sm:h-[calc(100vh-204px)]">
        <div>
          <div className="flex flex-col gap-3">
            <Image
              src={aboutInfo?.profileImage ?? ""}
              alt="Profile image"
              width={144}
              height={144}
              className="rounded-full"
            />
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
        <div className="flex flex-col gap-6 pr-4">
          {projects?.map((project: Project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-200 p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:from-gray-900 dark:to-gray-800"
            >
              <div className="relative mb-4">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform duration-300 group-hover:scale-105"
                  />
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 rounded-full bg-black/70 p-2 text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110"
                    >
                      <IconExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold tracking-tight">
                    {project.title}
                  </h2>
                </div>

                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.skills?.map((p) => (
                    <Badge
                      key={p.skill.id}
                      variant="secondary"
                      className="bg-gray-100 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {p.skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default Content;
