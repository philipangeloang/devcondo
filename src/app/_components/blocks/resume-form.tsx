/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Toaster } from "@/app/_components/ui/sonner";

import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { ExperiencesForm } from "./experiences-form";
import { EducationForm } from "./education-form";
import { CertificationsForm } from "./certifications-form";
import Loader from "@/app/_components/blocks/loader";

const resumeFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 numbers"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
});

export function ResumeForm() {
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] =
    useState(false);

  // TRPC Hooks
  const utils = api.useUtils();
  const { data: resumeInfo, isLoading: isResumeLoading } =
    api.resume.get.useQuery();
  const { mutate: create } = api.resume.create.useMutation({
    onSuccess: async ({ message }) => {
      await utils.resume.invalidate();
      setIsEditing(false);
      setIsSaving(false);
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async (error) => {
      setIsSaving(false);
      toast("Error", {
        description: error.message,
      });
    },
  });
  const { mutate: update } = api.resume.update.useMutation({
    onSuccess: async ({ message }) => {
      await utils.resume.invalidate();
      setIsEditing(false);
      setIsSaving(false);
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async (error) => {
      setIsSaving(false);
      toast("Error", {
        description: error.message,
      });
    },
  });
  const form = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
  });

  function onSubmit(values: z.infer<typeof resumeFormSchema>) {
    try {
      if (!resumeInfo) {
        setIsSaving(true);
        create(values);
      } else {
        setIsSaving(true);
        update(values);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (resumeInfo && !isResumeLoading) {
      form.reset(resumeInfo);
    }
  }, [resumeInfo, isResumeLoading, form]);

  return (
    <>
      <Toaster />
      {isResumeLoading ? (
        <Loader />
      ) : (
        <Tabs
          defaultValue="basic"
          className="flex w-full"
          orientation="vertical"
        >
          <div className="w-64 shrink-0 rounded-lg bg-zinc-50 p-6 dark:bg-zinc-900/50">
            <TabsList className="flex h-auto flex-col space-y-2">
              <TabsTrigger
                value="basic"
                className="w-full cursor-pointer justify-start rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Basic Details
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="w-full cursor-pointer justify-start rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Experience
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="w-full cursor-pointer justify-start rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
                Education
              </TabsTrigger>
              <TabsTrigger
                value="certifications"
                className="w-full cursor-pointer justify-start rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                Certifications
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Basic Details Tab */}
            <TabsContent
              value="basic"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Basic Details
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Add your personal and contact information
                  </p>
                </div>
                <Form {...form}>
                  <Toaster />
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        disabled={!isEditing}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your Full Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        disabled={!isEditing}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g. Full Stack Developer"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        disabled={!isEditing}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="example@email.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        disabled={!isEditing}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(555) 123-4567" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      disabled={!isEditing}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="City, State" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={!isEditing}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Summary</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Write a brief summary of your professional background"
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button
                        className="text-skin-base dark:bg-skin-fill cursor-pointer bg-white"
                        onClick={() => {
                          setIsEditing(!isEditing);
                        }}
                        type="button"
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                      <Button
                        disabled={!isEditing}
                        className="cursor-pointer dark:bg-white dark:text-black"
                        type="submit"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent
              value="experience"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        Experience
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Add your work experience
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsExperienceDialogOpen(true)}
                      className="cursor-pointer dark:bg-white dark:text-black"
                    >
                      <IconPlus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>
                  </div>
                </div>
                <ExperiencesForm
                  resumeId={resumeInfo?.id || 0}
                  addExperienceDialogOpen={isExperienceDialogOpen}
                  setAddExperienceDialogOpen={setIsExperienceDialogOpen}
                />
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent
              value="education"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      Education
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Add your educational background
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEducationDialogOpen(true)}
                    className="cursor-pointer dark:bg-white dark:text-black"
                  >
                    <IconPlus className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                </div>
                <EducationForm
                  resumeId={resumeInfo?.id || 0}
                  addEducationDialogOpen={isEducationDialogOpen}
                  setAddEducationDialogOpen={setIsEducationDialogOpen}
                />
              </div>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent
              value="certifications"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      Certifications
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Add your certifications and licenses
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsCertificationDialogOpen(true)}
                    className="cursor-pointer dark:bg-white dark:text-black"
                  >
                    <IconPlus className="mr-2 h-4 w-4" /> Add Certification
                  </Button>
                </div>
                <CertificationsForm
                  resumeId={resumeInfo?.id || 0}
                  addCertificationDialogOpen={isCertificationDialogOpen}
                  setAddCertificationDialogOpen={setIsCertificationDialogOpen}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}
    </>
  );
}
