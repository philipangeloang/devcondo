"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconEdit, IconTrash, IconLoader } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/app/_components/ui/sonner";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Textarea } from "@/app/_components/ui/textarea";
import { Input } from "@/app/_components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
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
import { Separator } from "@/app/_components/ui/separator";
import { Badge } from "@/app/_components/ui/badge";
import { IconCheck, IconSelector } from "@tabler/icons-react";
import ExperienceLoader from "@/app/_components/blocks/experience-loader";

const projectSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  projectUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
  skillIds: z
    .array(z.number())
    .nonempty({ message: "Select at least one skill." }),
});

type ProjectsFormProps = {
  addProjectDialog: boolean;
  setAddProjectDialog: (open: boolean) => void;
};

export function ProjectsForm({
  addProjectDialog,
  setAddProjectDialog,
}: ProjectsFormProps) {
  // States
  const [editDialogOpen, setEditDialogOpen] = useState<number | null>(null); // Store the ID of the project being edited
  const [editDialogOpenMobile, setEditDialogOpenMobile] = useState<
    number | null
  >(null); // Store the ID of the project being edited for Mobile Cards
  const [isCreating, setIsCreating] = useState(false); //for loading state
  const [editId, setEditId] = useState<number>(0);

  // TRPC Hooks
  const utils = api.useUtils();

  const { data: allSkills } = api.skill.get.useQuery();
  const {
    data: projectRelativeSkill,
    isLoading: isLoadingProjectRelativeSkills,
    isFetching: isFetchingProjectRelativeSkills,
  } = api.projectSkills.getUpdateFormSkill.useQuery(editId);
  const {
    data: allProjectWithSkills,
    isLoading: isLoadingProjectWithSkills,
    isFetching: isFetchingProjectwithSkills,
  } = api.project.getProjectsWithSkills.useQuery();

  const { mutate: create } = api.project.create.useMutation({
    onSuccess: async ({ message }) => {
      await utils.project.invalidate();
      setIsCreating(false);
      setAddProjectDialog(false);
      form.reset();
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async (error) => {
      setIsCreating(false);
      setAddProjectDialog(false);
      toast("Error", {
        description: error.message,
      });
    },
  });
  const { mutate: update } = api.project.update.useMutation({
    onSuccess: async ({ message }) => {
      // Invalidate all relevant queries to refetch fresh data
      await Promise.all([
        utils.project.invalidate(),
        utils.projectSkills.invalidate(),
        utils.project.getProjectsWithSkills.invalidate(), // If this is a specific query
      ]);

      setIsCreating(false);
      setEditDialogOpen(null);
      updateForm.reset();
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async (error) => {
      setIsCreating(false);
      setEditDialogOpen(null);
      toast("Error", {
        description: error.message,
      });
    },
  });
  const { mutate: deleteProject } = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.invalidate();
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

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      projectUrl: "",
      skillIds: [],
    },
  });

  const updateForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      projectUrl: "",
      skillIds: [],
    },
  });

  function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      setIsCreating(true);
      create(values);
    } catch (error) {
      console.error(error);
    }
  }

  function onEdit(values: z.infer<typeof projectSchema>) {
    try {
      setIsCreating(true);
      update({ ...values, id: editId });
    } catch (error) {
      console.error(error);
    }
  }

  // Conditionally Render Hooks on Edit
  useEffect(() => {
    if (editId !== null) {
      const project = allProjectWithSkills?.find((p) => p.id === editId);
      if (project) {
        updateForm.reset({
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl,
          projectUrl: project.projectUrl ?? "",
          skillIds: projectRelativeSkill ?? [], // This should now be up-to-date after invalidation
        });
      }
    }
  }, [editId, allProjectWithSkills, updateForm, projectRelativeSkill]);

  return (
    <>
      <Dialog
        open={addProjectDialog}
        onOpenChange={(open) => {
          if (!open) {
            if (!isCreating) {
              setAddProjectDialog(false);
              form.reset();
            }
          } else {
            setAddProjectDialog(true);
          }
        }}
      >
        <Toaster />

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>
              Add project here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your project description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input placeholder="Your project image" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skillIds" // This field will store the selected values
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies Used</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value?.length > 0
                              ? `${field.value.length} selected`
                              : "Select frameworks..."}
                            <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search framework..." />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {allSkills?.map((framework) => {
                                  const isSelected = field.value.includes(
                                    framework.id,
                                  );
                                  const isInactiveAndNotSelected =
                                    !framework.isActive && !isSelected;

                                  return (
                                    <CommandItem
                                      key={framework.id}
                                      onSelect={() => {
                                        // If it's inactive and not already selected, prevent selection
                                        if (isInactiveAndNotSelected) return;

                                        field.onChange(
                                          field.value.includes(framework.id)
                                            ? field.value.filter(
                                                (id) => id !== framework.id,
                                              )
                                            : [...field.value, framework.id],
                                        );
                                      }}
                                      className={cn(
                                        "flex items-center justify-between",
                                        isInactiveAndNotSelected &&
                                          "cursor-not-allowed opacity-50",
                                      )}
                                    >
                                      <div className="flex items-center">
                                        <IconCheck
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            isSelected
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        <span
                                          className={cn(
                                            isInactiveAndNotSelected &&
                                              "text-muted-foreground",
                                          )}
                                        >
                                          {framework.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {!framework.isActive && (
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              "ml-2 text-xs",
                                              isSelected &&
                                                "bg-yellow-100 dark:bg-yellow-900/30",
                                            )}
                                          >
                                            {isSelected
                                              ? "Removable"
                                              : "Inactive"}
                                          </Badge>
                                        )}
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Your project URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                >
                  {isCreating ? "Saving..." : "Save Project"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Separator className="my-5" />
      {isLoadingProjectWithSkills || isFetchingProjectwithSkills ? (
        <ExperienceLoader />
      ) : (
        <>
          {/* Bigger Screen Size Table */}
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProjectWithSkills?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    {project.skills?.map((p) => p.skill.name).join(", ")}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {/* Edit Dialog */}
                    <Dialog
                      open={editDialogOpen === project.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          if (!isCreating) {
                            setEditDialogOpen(null);
                            updateForm.reset();
                          }
                        } else {
                          setEditDialogOpen(project.id);
                          setEditId(project.id);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                        >
                          <IconEdit />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Project</DialogTitle>
                          <DialogDescription>
                            Edit project here. Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        {isLoadingProjectRelativeSkills ||
                        isFetchingProjectRelativeSkills ? (
                          <IconLoader size={24} className="animate-spin" />
                        ) : (
                          <Form {...updateForm}>
                            <form
                              onSubmit={updateForm.handleSubmit(onEdit)}
                              className="space-y-4"
                            >
                              <FormField
                                control={updateForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your project title"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Your project description"
                                        className="resize-none"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                name="imageUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your project image"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                name="skillIds"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Technologies Used</FormLabel>
                                    <FormControl>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                          >
                                            {field.value?.length > 0
                                              ? `${field.value.length} selected`
                                              : "Select frameworks..."}
                                            <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                          <Command>
                                            <CommandInput placeholder="Search framework..." />
                                            <CommandList>
                                              <CommandEmpty>
                                                No framework found.
                                              </CommandEmpty>
                                              <CommandGroup>
                                                {allSkills?.map((framework) => {
                                                  const isSelected =
                                                    field.value.includes(
                                                      framework.id,
                                                    );
                                                  const isInactiveAndNotSelected =
                                                    !framework.isActive &&
                                                    !isSelected;

                                                  return (
                                                    <CommandItem
                                                      key={framework.id}
                                                      onSelect={() => {
                                                        // If it's inactive and not already selected, prevent selection
                                                        if (
                                                          isInactiveAndNotSelected
                                                        )
                                                          return;

                                                        field.onChange(
                                                          field.value.includes(
                                                            framework.id,
                                                          )
                                                            ? field.value.filter(
                                                                (id) =>
                                                                  id !==
                                                                  framework.id,
                                                              )
                                                            : [
                                                                ...field.value,
                                                                framework.id,
                                                              ],
                                                        );
                                                      }}
                                                      className={cn(
                                                        "flex items-center justify-between",
                                                        isInactiveAndNotSelected &&
                                                          "cursor-not-allowed opacity-50",
                                                      )}
                                                    >
                                                      <div className="flex items-center">
                                                        <IconCheck
                                                          className={cn(
                                                            "mr-2 h-4 w-4",
                                                            isSelected
                                                              ? "opacity-100"
                                                              : "opacity-0",
                                                          )}
                                                        />
                                                        <span
                                                          className={cn(
                                                            isInactiveAndNotSelected &&
                                                              "text-muted-foreground",
                                                          )}
                                                        >
                                                          {framework.name}
                                                        </span>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                        {!framework.isActive && (
                                                          <Badge
                                                            variant="outline"
                                                            className={cn(
                                                              "ml-2 text-xs",
                                                              isSelected &&
                                                                "bg-yellow-100 dark:bg-yellow-900/30",
                                                            )}
                                                          >
                                                            {isSelected
                                                              ? "Removable"
                                                              : "Inactive"}
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </CommandItem>
                                                  );
                                                })}
                                              </CommandGroup>
                                            </CommandList>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={updateForm.control}
                                name="projectUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Project URL</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your project URL"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div>
                                <Button
                                  type="submit"
                                  disabled={isCreating}
                                  className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                                >
                                  {isCreating ? "Saving..." : "Save Project"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Delete Alert Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="cursor-pointer bg-red-500 text-white dark:bg-red-500"
                        >
                          <IconTrash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="cursor-pointer bg-red-500 text-white dark:bg-red-500"
                            onClick={() => deleteProject(project.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Lower Screen Size Cards */}
          <div className="grid grid-cols-12 gap-4 md:hidden">
            {allProjectWithSkills?.map((project) => (
              <div
                key={project.id}
                className="relative col-span-6 flex flex-col gap-4 rounded-lg bg-black p-8 text-white dark:bg-white dark:text-black"
              >
                <div className="flex gap-2">
                  {project.skills?.map((p) => p.skill.name).join(", ")}
                </div>
                <h2 className="text-2xl font-semibold">{project.title}</h2>
                <p className="text-sm">{project.description}</p>
                <div className="flex w-full gap-2">
                  {/* Edit Dialog */}
                  <Dialog
                    open={editDialogOpenMobile === project.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        if (!isCreating) {
                          setEditDialogOpenMobile(null);
                          updateForm.reset();
                        }
                      } else {
                        setEditDialogOpenMobile(project.id);
                        setEditId(project.id);
                      }
                    }}
                  >
                    <DialogTrigger className="w-full" asChild>
                      <Button className="cursor-pointer bg-white text-black dark:bg-black dark:text-white">
                        <IconEdit />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                          Edit project here. Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      {isLoadingProjectRelativeSkills ? (
                        <IconLoader size={24} className="animate-spin" />
                      ) : (
                        <Form {...updateForm}>
                          <form
                            onSubmit={updateForm.handleSubmit(onEdit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={updateForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Your project title"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={updateForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Your project description"
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={updateForm.control}
                              name="imageUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Your project image"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={updateForm.control}
                              name="skillIds"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Technologies Used</FormLabel>
                                  <FormControl>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className="w-full justify-between"
                                        >
                                          {field.value?.length > 0
                                            ? `${field.value.length} selected`
                                            : "Select frameworks..."}
                                          <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-full p-0">
                                        <Command>
                                          <CommandInput placeholder="Search framework..." />
                                          <CommandList>
                                            <CommandEmpty>
                                              No framework found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {allSkills?.map((framework) => {
                                                const isSelected =
                                                  field.value.includes(
                                                    framework.id,
                                                  );
                                                const isInactiveAndNotSelected =
                                                  !framework.isActive &&
                                                  !isSelected;

                                                return (
                                                  <CommandItem
                                                    key={framework.id}
                                                    onSelect={() => {
                                                      // If it's inactive and not already selected, prevent selection
                                                      if (
                                                        isInactiveAndNotSelected
                                                      )
                                                        return;

                                                      field.onChange(
                                                        field.value.includes(
                                                          framework.id,
                                                        )
                                                          ? field.value.filter(
                                                              (id) =>
                                                                id !==
                                                                framework.id,
                                                            )
                                                          : [
                                                              ...field.value,
                                                              framework.id,
                                                            ],
                                                      );
                                                    }}
                                                    className={cn(
                                                      "flex items-center justify-between",
                                                      isInactiveAndNotSelected &&
                                                        "cursor-not-allowed opacity-50",
                                                    )}
                                                  >
                                                    <div className="flex items-center">
                                                      <IconCheck
                                                        className={cn(
                                                          "mr-2 h-4 w-4",
                                                          isSelected
                                                            ? "opacity-100"
                                                            : "opacity-0",
                                                        )}
                                                      />
                                                      <span
                                                        className={cn(
                                                          isInactiveAndNotSelected &&
                                                            "text-muted-foreground",
                                                        )}
                                                      >
                                                        {framework.name}
                                                      </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      {!framework.isActive && (
                                                        <Badge
                                                          variant="outline"
                                                          className={cn(
                                                            "ml-2 text-xs",
                                                            isSelected &&
                                                              "bg-yellow-100 dark:bg-yellow-900/30",
                                                          )}
                                                        >
                                                          {isSelected
                                                            ? "Removable"
                                                            : "Inactive"}
                                                        </Badge>
                                                      )}
                                                    </div>
                                                  </CommandItem>
                                                );
                                              })}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={updateForm.control}
                              name="projectUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project URL</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Your project URL"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div>
                              <Button
                                type="submit"
                                disabled={isCreating}
                                className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                              >
                                {isCreating ? "Saving..." : "Save Project"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Delete Alert Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger className="w-full" asChild>
                      <Button
                        variant="outline"
                        className="cursor-pointer bg-red-500 text-white dark:bg-red-500"
                      >
                        <IconTrash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your project.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer bg-red-500 text-white dark:bg-red-500"
                          onClick={() => deleteProject(project.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
