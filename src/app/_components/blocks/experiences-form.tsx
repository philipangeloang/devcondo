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
import { toast } from "sonner";
import { Card, CardContent } from "@/app/_components/ui/card";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";

import Loader from "@/app/_components/blocks/experience-loader";

// Helper function to format date to year
function formatDateToYear(dateString: string | undefined | null): string {
  if (!dateString) return "Present";
  try {
    return new Date(dateString).getFullYear().toString();
  } catch (error) {
    return dateString;
  }
}

const experienceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ExperienceFormProps = {
  resumeId: number;
  addExperienceDialogOpen: boolean;
  setAddExperienceDialogOpen: (open: boolean) => void;
};

export function ExperiencesForm({
  resumeId,
  addExperienceDialogOpen,
  setAddExperienceDialogOpen,
}: ExperienceFormProps) {
  // States
  const [isSaving, setIsSaving] = useState(false);
  const [editExperienceDialogOpen, setEditExperienceDialogOpen] = useState<
    number | null
  >(null);
  const [editId, setEditId] = useState<number>(0);

  // TRPC Hooks
  const utils = api.useUtils();
  const {
    data: experiences,
    isLoading: isExperiencesLoading,
    isFetching: isExperiencesFetching,
  } = api.experiences.getByResumeId.useQuery(resumeId, { enabled: !!resumeId });

  // Form hooks
  const experienceForm = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const updateExperienceForm = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  // Mutations
  const { mutate: create } = api.experiences.create.useMutation({
    onSuccess: async ({ message }) => {
      await utils.experiences.invalidate();
      setAddExperienceDialogOpen(false);
      experienceForm.reset();
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

  const { mutate: update } = api.experiences.update.useMutation({
    onSuccess: async ({ message }) => {
      await utils.experiences.invalidate();
      setEditExperienceDialogOpen(null);
      updateExperienceForm.reset();
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

  const { mutate: deleteExperience } = api.experiences.delete.useMutation({
    onSuccess: async () => {
      await utils.experiences.invalidate();
      toast("Successfully Deleted", {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async (error) => {
      toast("Error", {
        description: error.message,
      });
    },
  });

  // Form handlers
  function onSubmit(values: z.infer<typeof experienceSchema>) {
    try {
      setIsSaving(true);
      create({ ...values, resumeId });
    } catch (error) {
      console.error(error);
    }
  }

  function onUpdate(values: z.infer<typeof experienceSchema>) {
    try {
      setIsSaving(true);
      update({ ...values, id: editId });
    } catch (error) {
      console.error(error);
    }
  }

  // Reset form handlers
  useEffect(() => {
    if (editId !== null) {
      const experience = experiences?.find((p) => p.id === editId);
      if (experience) {
        const formData = {
          title: experience.title,
          company: experience.company,
          startDate: experience.startDate,
          description: experience.description,
        };

        if (experience.endDate) {
          updateExperienceForm.reset({
            ...formData,
            endDate: experience.endDate,
          });
        } else {
          updateExperienceForm.reset(formData);
        }
      }
    }
  }, [editId, experiences, updateExperienceForm]);

  return (
    <div className="space-y-4">
      <Dialog
        open={addExperienceDialogOpen}
        onOpenChange={setAddExperienceDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
            <DialogDescription>
              Add your work experience here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...experienceForm}>
            <form
              onSubmit={experienceForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={experienceForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={experienceForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={experienceForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={experienceForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={experienceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter bullet points separated by semicolons (;)&#10;Example:&#10;Led a team of 5 developers;Increased performance by 50%;Implemented new features"
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-muted-foreground text-xs">
                      Separate each bullet point with a semicolon (;)
                    </p>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Experience"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Experience List */}
      {isExperiencesLoading || isExperiencesFetching ? (
        <Loader />
      ) : experiences?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No experiences added yet.
          </p>
        </div>
      ) : (
        experiences?.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="flex items-start justify-between p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">{experience.title}</h3>
                <p className="text-sm text-zinc-500">{experience.company}</p>
                <p className="text-sm text-zinc-500">
                  {formatDateToYear(experience.startDate)} -{" "}
                  {formatDateToYear(experience.endDate)}
                </p>
                <ul className="list-disc space-y-1 pl-4">
                  {experience.description.split(";").map((bullet, index) => (
                    <li key={index} className="text-sm">
                      {bullet.trim()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-2">
                <Dialog
                  open={editExperienceDialogOpen === experience.id}
                  onOpenChange={(open) => {
                    setEditExperienceDialogOpen(open ? experience.id : null);
                    setEditId(experience.id);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                      size="icon"
                    >
                      <IconEdit />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Experience</DialogTitle>
                      <DialogDescription>
                        Edit your work experience here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...updateExperienceForm}>
                      <form
                        onSubmit={updateExperienceForm.handleSubmit(onUpdate)}
                        className="space-y-4"
                      >
                        <FormField
                          control={updateExperienceForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Software Engineer"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={updateExperienceForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Google" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={updateExperienceForm.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={updateExperienceForm.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={updateExperienceForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter bullet points separated by semicolons (;)&#10;Example:&#10;Led a team of 5 developers;Increased performance by 50%;Implemented new features"
                                  className="min-h-[150px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-muted-foreground text-xs">
                                Separate each bullet point with a semicolon (;)
                              </p>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="cursor-pointer bg-red-500 text-white dark:bg-red-500"
                      size="icon"
                    >
                      <IconTrash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this experience? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteExperience(experience.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
