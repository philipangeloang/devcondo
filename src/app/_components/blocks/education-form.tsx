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

import ExperienceLoader from "@/app/_components/blocks/experience-loader";

// Helper function to format date to year
function formatDateToYear(dateString: string | undefined | null): string {
  if (!dateString) return "Present";
  try {
    return new Date(dateString).getFullYear().toString();
  } catch (error) {
    return dateString;
  }
}

const educationSchema = z.object({
  degree: z.string().min(2, "Degree must be at least 2 characters"),
  university: z.string().min(2, "University must be at least 2 characters"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().optional(),
});

type EducationFormProps = {
  resumeId: number;
  addEducationDialogOpen: boolean;
  setAddEducationDialogOpen: (open: boolean) => void;
};

export function EducationForm({
  resumeId,
  addEducationDialogOpen,
  setAddEducationDialogOpen,
}: EducationFormProps) {
  // States
  const [isSaving, setIsSaving] = useState(false);
  const [editEducationDialogOpen, setEditEducationDialogOpen] = useState<
    number | null
  >(null);
  const [editId, setEditId] = useState<number>(0);

  // TRPC Hooks
  const utils = api.useUtils();
  const {
    data: educations,
    isLoading: isEducationsLoading,
    isFetching: isEducationsFetching,
  } = api.education.getByResumeId.useQuery(resumeId, { enabled: !!resumeId });

  // Form hooks
  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      university: "",
      startDate: "",
      endDate: "",
    },
  });

  const updateEducationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      university: "",
      startDate: "",
      endDate: "",
    },
  });

  // Mutations
  const { mutate: create } = api.education.create.useMutation({
    onSuccess: async ({ message }) => {
      await utils.education.invalidate();
      setAddEducationDialogOpen(false);
      educationForm.reset();
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

  const { mutate: update } = api.education.update.useMutation({
    onSuccess: async ({ message }) => {
      await utils.education.invalidate();
      setEditEducationDialogOpen(null);
      updateEducationForm.reset();
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

  const { mutate: deleteEducation } = api.education.delete.useMutation({
    onSuccess: async () => {
      await utils.education.invalidate();
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
  function onSubmit(values: z.infer<typeof educationSchema>) {
    try {
      setIsSaving(true);
      create({ ...values, resumeId });
    } catch (error) {
      console.error(error);
    }
  }

  function onUpdate(values: z.infer<typeof educationSchema>) {
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
      const education = educations?.find((p) => p.id === editId);
      if (education) {
        const formData = {
          degree: education.degree,
          university: education.university,
          startDate: education.startDate,
        };

        if (education.endDate) {
          updateEducationForm.reset({
            ...formData,
            endDate: education.endDate,
          });
        } else {
          updateEducationForm.reset(formData);
        }
      }
    }
  }, [editId, educations, updateEducationForm]);

  return (
    <div className="space-y-4">
      <Dialog
        open={addEducationDialogOpen}
        onOpenChange={setAddEducationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
            <DialogDescription>
              Add your education here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...educationForm}>
            <form
              onSubmit={educationForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={educationForm.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Bachelor of Science in Computer Science"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Stanford University"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={educationForm.control}
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
                  control={educationForm.control}
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
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Education"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Education List */}
      {isEducationsLoading || isEducationsFetching ? (
        <ExperienceLoader />
      ) : educations?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No education added yet.
          </p>
        </div>
      ) : (
        educations?.map((education) => (
          <Card key={education.id}>
            <CardContent className="flex items-start justify-between p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">{education.degree}</h3>
                <p className="text-sm text-zinc-500">{education.university}</p>
                <p className="text-sm text-zinc-500">
                  {formatDateToYear(education.startDate)} -{" "}
                  {formatDateToYear(education.endDate)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog
                  open={editEducationDialogOpen === education.id}
                  onOpenChange={(open) => {
                    setEditEducationDialogOpen(open ? education.id : null);
                    setEditId(education.id);
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
                      <DialogTitle>Edit Education</DialogTitle>
                      <DialogDescription>
                        Edit your education here. Click save when you&apos;re
                        done.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...updateEducationForm}>
                      <form
                        onSubmit={updateEducationForm.handleSubmit(onUpdate)}
                        className="space-y-4"
                      >
                        <FormField
                          control={updateEducationForm.control}
                          name="degree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Bachelor of Science in Computer Science"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={updateEducationForm.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Stanford University"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={updateEducationForm.control}
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
                            control={updateEducationForm.control}
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
                      <AlertDialogTitle>Delete Education</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this education? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteEducation(education.id)}
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
