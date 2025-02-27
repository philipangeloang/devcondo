"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/app/_components/ui/sonner";
import { IconLoader } from "@tabler/icons-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import ProviderSignout from "../auth/providers-signout";

const aboutFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  profileImage: z.string().url({
    message: "Please enter a valid URL.",
  }),
  socials: z.object({
    twitter: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    tiktok: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    instagram: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    youtube: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    linkedin: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    facebook: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .optional()
      .or(z.literal("")),
  }),
});

const AboutForm = () => {
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // TRPC hooks
  const utils = api.useUtils();
  const { data: aboutInfo, isLoading: isAboutInfoLoading } =
    api.aboutInfo.get.useQuery();
  const { mutate: create } = api.aboutInfo.create.useMutation({
    onSuccess: async ({ message }) => {
      await utils.aboutInfo.invalidate();
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
  const { mutate: update } = api.aboutInfo.update.useMutation({
    onSuccess: async ({ message }) => {
      await utils.aboutInfo.invalidate();
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

  // Form Data
  const form = useForm<z.infer<typeof aboutFormSchema>>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      profileImage: "",
      socials: {
        twitter: "",
        github: "",
        tiktok: "",
        instagram: "",
        youtube: "",
        linkedin: "",
        facebook: "",
        email: "",
      },
    },
  });

  // Submit handler
  function onSubmit(values: z.infer<typeof aboutFormSchema>) {
    try {
      if (!aboutInfo) {
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

  // Initial Fetching of data
  useEffect(() => {
    if (aboutInfo && !isAboutInfoLoading) {
      form.reset({
        ...aboutInfo,
        profileImage: aboutInfo.profileImage ?? "",
        socials: {
          ...aboutInfo.socials,
          twitter: aboutInfo.socials?.twitter ?? "",
          github: aboutInfo.socials?.github ?? "",
          tiktok: aboutInfo.socials?.tiktok ?? "",
          instagram: aboutInfo.socials?.instagram ?? "",
          youtube: aboutInfo.socials?.youtube ?? "",
          linkedin: aboutInfo.socials?.linkedin ?? "",
          facebook: aboutInfo.socials?.facebook ?? "",
          email: aboutInfo.socials?.email ?? "",
        },
      });
    }
  }, [aboutInfo, isAboutInfoLoading, form]);

  return (
    <>
      {isAboutInfoLoading ? (
        <IconLoader size={24} className="animate-spin" />
      ) : (
        <Form {...form}>
          <Toaster />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditing}
                      placeholder="Your website display name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditing}
                      placeholder="e.g. Full-Stack Developer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={!isEditing}
                      placeholder="Write a short bio about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will appear in the About Me section of your portfolio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditing}
                      placeholder="https://example.com/your-image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the URL of your profile image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Social Media Accounts</h3>
                <p className="text-muted-foreground text-sm">
                  Add your social media profiles. Leave empty if not applicable.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="socials.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socials.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socials.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socials.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socials.youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socials.tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socials.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socials.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
              <ProviderSignout />
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default AboutForm;
