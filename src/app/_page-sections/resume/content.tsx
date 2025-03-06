"use client";
import { Badge } from "@/app/_components/ui/badge";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { Briefcase, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { api } from "@/trpc/react";
import ExperienceLoader from "@/app/_components/blocks/experience-loader";
import { Separator } from "@/app/_components/ui/separator";

const Content = () => {
  const { data: resumeInfo, isLoading: resumeLoading } =
    api.resume.get.useQuery();
  const { data: experiences, isLoading: experiencesLoading } =
    api.experiences.getByResumeId.useQuery(resumeInfo?.id ?? 0, {
      enabled: !!resumeInfo?.id,
    });
  const { data: education, isLoading: educationLoading } =
    api.education.getByResumeId.useQuery(resumeInfo?.id ?? 0, {
      enabled: !!resumeInfo?.id,
    });
  const { data: certifications, isLoading: certificationsLoading } =
    api.certifications.getByResumeId.useQuery(resumeInfo?.id ?? 0, {
      enabled: !!resumeInfo?.id,
    });
  const { data: activeSkills, isLoading: skillsLoading } =
    api.skill.getActive.useQuery();

  if (
    resumeLoading ||
    experiencesLoading ||
    educationLoading ||
    certificationsLoading ||
    skillsLoading
  ) {
    return <ExperienceLoader />;
  }

  return (
    <>
      <ScrollArea className="col-span-12 h-[calc(100vh-204px)] rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="mx-auto max-w-4xl space-y-8 py-10">
          {/* Header Section */}
          <div className="relative border-b pb-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-black">
                {resumeInfo?.fullName}
              </h1>
              <h2 className="text-2xl font-medium text-gray-700">
                {resumeInfo?.title}
              </h2>
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-100 p-1.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  {resumeInfo?.location}
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-100 p-1.5">
                    <Mail className="h-4 w-4" />
                  </div>
                  {resumeInfo?.email}
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-100 p-1.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  {resumeInfo?.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-wider text-black uppercase">
                Professional Summary
              </h3>
              <Separator className="flex-1 bg-gray-200 dark:bg-gray-200" />
            </div>
            <p className="text-gray-600">{resumeInfo?.summary}</p>
          </section>

          {/* Skills Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-wider text-black uppercase">
                Technical Skills
              </h3>
              <Separator className="flex-1 bg-gray-200 dark:bg-gray-200" />
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSkills?.map((skill) => (
                <Badge
                  key={skill.id}
                  className="border bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700 shadow-sm transition-all hover:from-gray-100 hover:to-gray-200 dark:border dark:border-gray-100/0"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-wider text-black uppercase">
                Experience
              </h3>
              <Separator className="flex-1 bg-gray-200 dark:bg-gray-200" />
            </div>
            <div className="space-y-6">
              {experiences?.map((experience) => (
                <div
                  key={experience.id}
                  className="relative space-y-3 rounded-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-black">
                          {experience.title}
                        </h4>
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        {experience.company}
                      </p>
                    </div>
                    <p className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                      {new Date(experience.startDate).getFullYear()} -{" "}
                      {experience.endDate
                        ? new Date(experience.endDate).getFullYear()
                        : "Present"}
                    </p>
                  </div>
                  <ul className="list-disc space-y-2 pl-6">
                    {experience.description.split(";").map((bullet, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {bullet.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-wider text-black uppercase">
                Education
              </h3>
              <Separator className="flex-1 bg-gray-200 dark:bg-gray-200" />
            </div>
            <div className="space-y-6">
              {education?.map((edu) => (
                <div
                  key={edu.id}
                  className="relative space-y-3 rounded-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-black">
                          {edu.degree}
                        </h4>
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        {edu.university}
                      </p>
                    </div>
                    <p className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                      {new Date(edu.startDate).getFullYear()} -{" "}
                      {edu.endDate
                        ? new Date(edu.endDate).getFullYear()
                        : "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-wider text-black uppercase">
                Certifications
              </h3>
              <Separator className="flex-1 bg-gray-200 dark:bg-gray-200" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {certifications?.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm"
                >
                  <span className="font-medium text-gray-700">
                    {cert.title}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                    {new Date(cert.yearAwarded).getFullYear()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </>
  );
};

export default Content;
