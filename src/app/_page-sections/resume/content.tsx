import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  Briefcase,
  GraduationCap,
  Laptop,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

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
      <ScrollArea className="col-span-12 rounded-lg bg-white p-8 data-[theme=dark]:border-gray-200 data-[theme=dark]:bg-white sm:h-[calc(100vh-204px)] [&_*]:!text-black">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">John Developer</h1>
            <h2 className="text-2xl text-gray-600">Senior Frontend Engineer</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                john@developer.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (555) 123-4567
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Professional Summary</h3>
            <p className="text-gray-600">
              Passionate frontend engineer with 8+ years of experience building
              responsive and performant web applications. Specialized in React,
              Next.js, and modern web technologies. Strong focus on user
              experience and accessibility.
            </p>
          </section>

          {/* Skills Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Node.js",
                "GraphQL",
                "REST APIs",
                "Git",
                "AWS",
                "Jest",
                "Cypress",
                "CI/CD",
              ].map((skill) => (
                <Badge
                  key={skill}
                  className="bg-gray-100 text-gray-900 hover:bg-gray-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-semibold">Experience</h3>
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 [&_*]:!text-black">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold">
                        Senior Frontend Engineer
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">TechCorp Inc.</p>
                  </div>
                  <p className="text-sm text-gray-600">2020 - Present</p>
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    Led the frontend development of the company&apos;s flagship
                    SaaS product
                  </li>
                  <li>
                    Improved application performance by 40% through code
                    optimization
                  </li>
                  <li>Mentored junior developers and conducted code reviews</li>
                  <li>
                    Implemented automated testing strategy reducing bugs by 60%
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 [&_*]:!text-black">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold">Frontend Developer</h4>
                    </div>
                    <p className="text-sm text-gray-600">StartupX</p>
                  </div>
                  <p className="text-sm text-gray-600">2018 - 2020</p>
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    Developed and maintained multiple client-facing applications
                  </li>
                  <li>
                    Collaborated with designers to implement pixel-perfect UIs
                  </li>
                  <li>Integrated third-party APIs and services</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Education Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-semibold">Education</h3>
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 [&_*]:!text-black">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold">B.S. Computer Science</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      University of Technology
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">2014 - 2018</p>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Relevant coursework: Web Development, Algorithms, Data
                  Structures, Software Engineering
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Certifications Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Certifications</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  AWS Certified Developer
                </Badge>
                <span className="text-sm text-gray-600">2023</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  Google Cloud Professional Developer
                </Badge>
                <span className="text-sm text-gray-600">2022</span>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </>
  );
};

export default Content;
