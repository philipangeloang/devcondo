"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { IconPlus, IconEdit, IconTrash, IconLoader } from "@tabler/icons-react";
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

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

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
  technologies: z.array(z.string()).optional(),
  projectUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
});

const updateProjectSchema = z.object({
  id: z.number(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  technologies: z.array(z.string()).optional(),
  projectUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
});

export function ProjectsForm() {
  // States
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState<number | null>(null); // Store the ID of the project being edited
  const [isCreating, setIsCreating] = useState(false); //for loading state
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // TRPC Hooks
  const utils = api.useUtils();
  const { data: allProjects, isLoading: allProjectsLoading } =
    api.project.get.useQuery();
  const { mutate: create } = api.project.create.useMutation({
    onSuccess: async () => {
      await utils.project.invalidate();
      setIsCreating(false);
      setAddDialogOpen(false);
      form.reset();
      toast("Successfully Added", {
        description: new Date().toLocaleTimeString(),
      });
    },
  });
  const { mutate: update } = api.project.update.useMutation({
    onSuccess: async () => {
      await utils.project.invalidate();
      setIsCreating(false);
      setEditDialogOpen(null);
      updateForm.reset();
      toast("Successfully Edited", {
        description: new Date().toLocaleTimeString(),
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
  });

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      technologies: [],
      projectUrl: "",
    },
  });

  const updateForm = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      id: 0,
      title: "",
      description: "",
      imageUrl: "",
      technologies: [],
      projectUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      setIsCreating(true);
      values.technologies = selectedValues;
      create(values);
      setSelectedValues([]);
    } catch (error) {
      console.error(error);
    }
  }

  function onEdit(values: z.infer<typeof updateProjectSchema>) {
    try {
      setIsCreating(true);
      values.technologies = selectedValues;
      update(values);
      setSelectedValues([]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <Toaster />
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setSelectedValues([]);
              form.reset();
            }}
            className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
          >
            <IconPlus /> Add Project
          </Button>
        </DialogTrigger>
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
                name="technologies"
                render={({ field }) => (
                  <>
                    <FormLabel>
                      Technologies Used <br />
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedValues.length > 0
                              ? `${selectedValues.length} selected`
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
                                {frameworks.map((framework) => (
                                  <CommandItem
                                    key={framework.value}
                                    onSelect={() => {
                                      setSelectedValues((prev) =>
                                        prev.includes(framework.value)
                                          ? prev.filter(
                                              (value) =>
                                                value !== framework.value,
                                            )
                                          : [...prev, framework.value],
                                      );
                                    }}
                                  >
                                    <IconCheck
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedValues.includes(framework.value)
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {framework.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </>
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
              <div className="">
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
      {allProjectsLoading ? (
        <IconLoader size={24} className="animate-spin" />
      ) : (
        <>
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
              {allProjects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    {project.technologies?.map((tech, index) => (
                      <span key={index} className="mr-2">
                        {tech}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {/* Edit Dialog */}
                    <Dialog
                      open={editDialogOpen === project.id}
                      onOpenChange={(isOpen) =>
                        setEditDialogOpen(isOpen ? project.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setSelectedValues(project.technologies ?? []);
                            updateForm.reset({
                              id: project.id,
                              title: project.title,
                              description: project.description,
                              imageUrl: project.imageUrl,
                              technologies: project.technologies ?? [],
                              projectUrl: project.projectUrl ?? "",
                            }); // Populate form with existing project data
                          }}
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
                              name="technologies"
                              render={({ field }) => (
                                <>
                                  <FormLabel>
                                    Technologies Used <br />
                                  </FormLabel>
                                  <FormControl>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className="w-full justify-between"
                                        >
                                          {selectedValues.length > 0
                                            ? `${selectedValues.length} selected`
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
                                              {frameworks.map((framework) => (
                                                <CommandItem
                                                  key={framework.value}
                                                  onSelect={() => {
                                                    setSelectedValues((prev) =>
                                                      prev.includes(
                                                        framework.value,
                                                      )
                                                        ? prev.filter(
                                                            (value) =>
                                                              value !==
                                                              framework.value,
                                                          )
                                                        : [
                                                            ...prev,
                                                            framework.value,
                                                          ],
                                                    );
                                                  }}
                                                >
                                                  <IconCheck
                                                    className={cn(
                                                      "mr-2 h-4 w-4",
                                                      selectedValues.includes(
                                                        framework.value,
                                                      )
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                    )}
                                                  />
                                                  {framework.label}
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                </>
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
                      </DialogContent>
                    </Dialog>

                    {/* Delete Alert Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="grid grid-cols-12 gap-4 md:hidden">
            {allProjects?.map((project) => (
              <div
                key={project.id}
                className="relative col-span-6 flex flex-col gap-4 rounded-lg bg-black p-8 text-white dark:bg-white dark:text-black"
              >
                <div className="flex gap-2">
                  {project.technologies?.map((p, index) => (
                    <Badge
                      className="bg-white text-black dark:bg-black dark:text-white"
                      key={index}
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-2xl font-semibold">{project.title}</h2>
                <p className="text-sm">{project.description}</p>
                <div className="flex w-full gap-2">
                  {/* Edit Dialog */}
                  <Dialog
                    open={editDialogOpen === project.id}
                    onOpenChange={(isOpen) =>
                      setEditDialogOpen(isOpen ? project.id : null)
                    }
                  >
                    <DialogTrigger className="w-full" asChild>
                      <Button
                        onClick={() => {
                          setSelectedValues(project.technologies ?? []);
                          updateForm.reset({
                            id: project.id,
                            title: project.title,
                            description: project.description,
                            imageUrl: project.imageUrl,
                            technologies: project.technologies ?? [],
                            projectUrl: project.projectUrl ?? "",
                          }); // Populate form with existing project data
                        }}
                        className="cursor-pointer bg-white text-black dark:bg-black dark:text-white"
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
                            name="technologies"
                            render={({ field }) => (
                              <>
                                <FormLabel>
                                  Technologies Used <br />
                                </FormLabel>
                                <FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between"
                                      >
                                        {selectedValues.length > 0
                                          ? `${selectedValues.length} selected`
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
                                            {frameworks.map((framework) => (
                                              <CommandItem
                                                key={framework.value}
                                                onSelect={() => {
                                                  setSelectedValues((prev) =>
                                                    prev.includes(
                                                      framework.value,
                                                    )
                                                      ? prev.filter(
                                                          (value) =>
                                                            value !==
                                                            framework.value,
                                                        )
                                                      : [
                                                          ...prev,
                                                          framework.value,
                                                        ],
                                                  );
                                                }}
                                              >
                                                <IconCheck
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedValues.includes(
                                                      framework.value,
                                                    )
                                                      ? "opacity-100"
                                                      : "opacity-0",
                                                  )}
                                                />
                                                {framework.label}
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                              </>
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
