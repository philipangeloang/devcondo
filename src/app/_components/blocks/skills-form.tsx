"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { toast } from "sonner";
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
import { Toaster } from "@/app/_components/ui/sonner";
import { Separator } from "@/app/_components/ui/separator";
import { Switch } from "@/app/_components/ui/switch";
import { IconEdit, IconTrash, IconBolt } from "@tabler/icons-react";
import { useState } from "react";
import { api } from "@/trpc/react";
import ExperienceLoader from "@/app/_components/blocks/experience-loader";
import { Card, CardContent } from "@/app/_components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/app/_components/ui/badge";

const skillsFormSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a skill name",
  }),
  isActive: z.boolean().default(true),
});

const updateSkillsFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, {
    message: "Please enter a skill name",
  }),
  isActive: z.boolean().default(true),
});

type SkillFormProps = {
  addSkillDialog: boolean;
  setAddSkillDialog: (open: boolean) => void;
};

export function SkillsForm({
  addSkillDialog,
  setAddSkillDialog,
}: SkillFormProps) {
  // States
  const [isCreating, setIsCreating] = useState(false); //for loading state
  const [editDialogOpen, setEditDialogOpen] = useState<number | null>(null); // Store the ID of the project being edited
  // TRPC Hooks
  const utils = api.useUtils();
  const { data: allSkills, isLoading: allSkillsLoading } =
    api.skill.get.useQuery();
  const { mutate: create } = api.skill.create.useMutation({
    onSuccess: async () => {
      await utils.skill.invalidate();
      setIsCreating(false);
      setAddSkillDialog(false);
      form.reset();
      toast("Successfully Added", {
        description: new Date().toLocaleTimeString(),
      });
    },
  });
  const { mutate: update } = api.skill.update.useMutation({
    onSuccess: async () => {
      await utils.skill.invalidate();
      setIsCreating(false);
      setEditDialogOpen(null);
      updateForm.reset();
      toast("Successfully Edited", {
        description: new Date().toLocaleTimeString(),
      });
    },
  });
  const { mutate: deleteSkill } = api.skill.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.project.invalidate(),
        utils.skill.invalidate(),
        utils.projectSkills.invalidate(),
      ]);
      toast("Successfully Deleted", {
        description: new Date().toLocaleTimeString(),
      });
    },
  });

  const form = useForm<z.infer<typeof skillsFormSchema>>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  const updateForm = useForm<z.infer<typeof updateSkillsFormSchema>>({
    resolver: zodResolver(updateSkillsFormSchema),
    defaultValues: {
      id: 0,
      name: "",
      isActive: true,
    },
  });

  // Get project skills to show usage count
  const { data: allProjectWithSkills } =
    api.project.getProjectsWithSkills.useQuery();

  // Function to get project count for a skill
  const getProjectCount = (skillId: number) => {
    return (
      allProjectWithSkills?.reduce((count, project) => {
        return (
          count + (project.skills?.some((ps) => ps.skillId === skillId) ? 1 : 0)
        );
      }, 0) ?? 0
    );
  };

  function onSubmit(values: z.infer<typeof skillsFormSchema>) {
    setIsCreating(true);
    create(values);
  }

  function onEdit(values: z.infer<typeof updateSkillsFormSchema>) {
    setIsCreating(true);
    update(values);
  }

  return (
    <>
      <Dialog
        open={addSkillDialog}
        onOpenChange={(open) => {
          if (!open) {
            if (!isCreating) {
              setAddSkillDialog(false);
              form.reset();
            }
          } else {
            setAddSkillDialog(true);
          }
        }}
      >
        <Toaster />

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription>
              Add skill here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React.js, Next.js, Laravel..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                >
                  {isCreating ? "Saving..." : "Save Skill"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Separator className="my-5" />
      {allSkillsLoading ? (
        <ExperienceLoader />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allSkills?.map((skill) => (
            <Card
              key={skill.id}
              className={cn(
                "group relative transition-all duration-300 hover:shadow-lg",
                skill.isActive
                  ? "border-border"
                  : "border-muted bg-muted/30 dark:bg-muted/10 border-dashed",
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          "text-lg font-semibold transition-colors",
                          !skill.isActive && "text-muted-foreground",
                        )}
                      >
                        {skill.name}
                      </h3>
                      {!skill.isActive && (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground border-dashed text-xs font-normal"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <IconBolt
                        size={16}
                        className={cn(
                          "text-yellow-500",
                          !skill.isActive && "text-muted-foreground",
                        )}
                      />
                      <span>{getProjectCount(skill.id)} projects</span>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Dialog
                      open={editDialogOpen === skill.id}
                      onOpenChange={(isOpen) => {
                        setEditDialogOpen(isOpen ? skill.id : null);
                        if (isOpen) {
                          updateForm.reset({
                            id: skill.id,
                            name: skill.name,
                            isActive: skill.isActive,
                          });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Skill</DialogTitle>
                          <DialogDescription>
                            Edit skill here. Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...updateForm}>
                          <form
                            onSubmit={updateForm.handleSubmit(onEdit)}
                            className="space-y-4"
                          >
                            {/* Hidden ID for editing purposes */}
                            <FormField
                              control={updateForm.control}
                              name="id"
                              render={({ field }) => (
                                <FormItem className="hidden">
                                  <FormLabel>Hidden ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Hidden ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={updateForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="React.js, Next.js, Laravel..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={updateForm.control}
                              name="isActive"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Active
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      Disabling a skill keeps it in existing
                                      projects but blocks it from being added to
                                      new projects.
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <div className="">
                              <Button
                                type="submit"
                                disabled={isCreating}
                                className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                              >
                                {isCreating ? "Saving..." : "Save"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-destructive h-8 w-8 cursor-pointer"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action is irreversible. Deleting this skill
                            will also remove it from all associated projects.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteSkill(skill.id);
                            }}
                            className="cursor-pointer bg-red-500"
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
