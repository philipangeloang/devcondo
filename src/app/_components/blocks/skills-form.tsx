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
import { IconLoader, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { api } from "@/trpc/react";

const skillsFormSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a skill name",
  }),
});

export function SkillsForm() {
  // States
  const [isCreating, setIsCreating] = useState(false); //for loading state
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

  const form = useForm<z.infer<typeof skillsFormSchema>>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof skillsFormSchema>) {
    // Here you would typically save the data to your backend
    setIsCreating(true);
    create(values);
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
                    <FormLabel>Title</FormLabel>
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
            <Badge key={skill.id}>{skill.name}</Badge>
          ))}
        </div>
      )}
    </>
  );
}
