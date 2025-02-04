import { Button } from "@/app/_components/ui/button";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { IconHandClick } from "@tabler/icons-react";
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

const Content = () => {
  return (
    <ScrollArea className="col-span-12 sm:h-[calc(100vh-204px)]">
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Information</CardTitle>
              <CardDescription>
                Manage your personal information and introduction
              </CardDescription>
            </CardHeader>
            <CardContent>{/* <AboutForm /> */} About</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Add and manage your portfolio projects
              </CardDescription>
            </CardHeader>
            <CardContent>{/* <ProjectsForm />  */} Projects</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Update your technical skills and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>{/* <SkillsForm />  */} Skills</CardContent>
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
            <CardContent>{/* <ResumeForm />  */} Resume</CardContent>
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
            <CardContent>{/* <SettingsForm />  */} Settings</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default Content;
