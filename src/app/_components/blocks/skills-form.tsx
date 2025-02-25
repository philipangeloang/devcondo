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
import { Badge } from "@/app/_components/ui/badge";
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
import { IconLoader, IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Switch } from "../ui/switch";

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

export function SkillsForm() {
  // States
  const [isCreating, setIsCreating] = useState(false); //for loading state
  const [editDialogOpen, setEditDialogOpen] = useState<number | null>(null); // Store the ID of the project being edited
  const [open, setOpen] = useState(false); //for dialog state
  // TRPC Hooks
  const utils = api.useUtils();
  const { data: allSkills, isLoading: allSkillsLoading } =
    api.skill.get.useQuery();
  const { mutate: create } = api.skill.create.useMutation({
    onSuccess: async () => {
      await utils.skill.invalidate();
      setIsCreating(false);
      setOpen(false);
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

  function onSubmit(values: z.infer<typeof skillsFormSchema>) {
    // Here you would typically save the data to your backend
    setIsCreating(true);
    create(values);
  }

  function onEdit(values: z.infer<typeof updateSkillsFormSchema>) {
    // Here you would typically save the data to your backend
    setIsCreating(true);
    update(values);
    console.log(values);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Toaster />
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              form.reset();
            }}
            className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
          >
            <IconPlus /> Add Skill
          </Button>
        </DialogTrigger>
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
        <IconLoader size={24} className="animate-spin" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {allSkills?.map((skill) => (
            <Dialog
              key={skill.id}
              open={editDialogOpen === skill.id}
              onOpenChange={(isOpen) =>
                setEditDialogOpen(isOpen ? skill.id : null)
              }
            >
              <Badge className="flex cursor-pointer justify-between gap-1">
                <DialogTrigger asChild>
                  <p
                    onClick={() => {
                      updateForm.reset({
                        id: skill.id,
                        name: skill.name,
                        isActive: skill.isActive,
                      });
                    }}
                  >
                    {skill.name}
                  </p>
                </DialogTrigger>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <IconX size={15} />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action is irreversible. Deleting this skill will
                        also remove it from all associated projects.
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
              </Badge>
              <DialogContent className="sm:max-w-[425px]">
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
                            <FormLabel className="text-base">Active</FormLabel>
                            <FormDescription className="text-xs">
                              Disabling a skill keeps it in existing projects
                              but blocks it from being added to new projects.
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
          ))}
        </div>
      )}
    </>
  );
}
