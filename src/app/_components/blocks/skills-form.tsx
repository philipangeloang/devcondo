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
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Badge } from "@/app/_components/ui/badge";
import { Plus, X } from "lucide-react";

const skillsFormSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
    }),
  ),
});

export function SkillsForm() {
  const form = useForm<z.infer<typeof skillsFormSchema>>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skills: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "skills",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof skillsFormSchema>) {
    // Here you would typically save the data to your backend
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`skills.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          {...field}
                          placeholder="Enter a skill"
                          className="w-[200px]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "" })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-medium">Preview:</h3>
            <div className="flex flex-wrap gap-2">
              {fields.map((field, index) => {
                const value = form.watch(`skills.${index}.name`);
                return value ? (
                  <Badge key={field.id} variant="secondary">
                    {value}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <Button type="submit">Save Skills</Button>
      </form>
    </Form>
  );
}
