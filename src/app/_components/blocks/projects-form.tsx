"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Card, CardContent } from "@/app/_components/ui/card";
import { Plus, Trash2 } from "lucide-react";

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
  technologies: z.string().min(2, {
    message: "Please enter at least one technology.",
  }),
  projectUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

const projectsFormSchema = z.object({
  projects: z.array(projectSchema),
});

export function ProjectsForm() {
  const form = useForm<z.infer<typeof projectsFormSchema>>({
    resolver: zodResolver(projectsFormSchema),
    defaultValues: {
      projects: [
        {
          title: "",
          description: "",
          imageUrl: "",
          technologies: "",
          projectUrl: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "projects",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof projectsFormSchema>) {
    // Here you would typically save the data to your backend
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Project {index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`projects.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.imageUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technologies Used</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="React, Node.js, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`projects.${index}.projectUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() =>
            append({
              title: "",
              description: "",
              imageUrl: "",
              technologies: "",
              projectUrl: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
        <Button type="submit">Save All Projects</Button>
      </form>
    </Form>
  );
}
