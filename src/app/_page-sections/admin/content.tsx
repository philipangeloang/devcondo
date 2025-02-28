"use client";

import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import AboutForm from "@/app/_components/blocks/about-form";
import { ProjectsForm } from "@/app/_components/blocks/projects-form";
import { SkillsForm } from "@/app/_components/blocks/skills-form";
import { ResumeForm } from "@/app/_components/blocks/resume-form";
import { SettingsForm } from "@/app/_components/blocks/settings-form";
import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { IconPlus } from "@tabler/icons-react";

const Content = () => {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);

  return (
    <ScrollArea className="col-span-12 sm:h-[calc(100vh-204px)]">
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="bg-skin-fill grid w-full grid-cols-5">
          <TabsTrigger className="cursor-pointer" value="about">
            About
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="projects">
            Projects
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="skills">
            Skills
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="resume">
            Resume
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="settings">
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Information</CardTitle>
              <CardDescription>
                Manage your personal information and introduction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AboutForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                  Add and manage your portfolio projects
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsProjectDialogOpen(true)}
                className="cursor-pointer dark:bg-white dark:text-black"
              >
                <IconPlus /> Add Project
              </Button>
            </CardHeader>
            <CardContent>
              <ProjectsForm
                addProjectDialog={isProjectDialogOpen}
                setAddProjectDialog={setIsProjectDialogOpen}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Update your technical skills and expertise
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsSkillDialogOpen(true)}
                className="cursor-pointer dark:bg-white dark:text-black"
              >
                <IconPlus /> Add Skill
              </Button>
            </CardHeader>
            <CardContent>
              <SkillsForm
                addSkillDialog={isSkillDialogOpen}
                setAddSkillDialog={setIsSkillDialogOpen}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>
                Edit your professional experience and resume details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Customize the appearance and behavior of your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default Content;
