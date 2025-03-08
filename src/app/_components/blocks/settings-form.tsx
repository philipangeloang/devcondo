"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Toaster } from "@/app/_components/ui/sonner";
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
import { Switch } from "@/app/_components/ui/switch";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import AboutLoader from "./about-loader";
import { skipToken } from "@tanstack/react-query";
import { IconCheck, IconLoader, IconX } from "@tabler/icons-react";

const settingsFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .optional(),
  darkMode: z.boolean().default(false),
});

export function SettingsForm() {
  // States
  const [isSaving, setIsSaving] = useState(false);
  const [checkAvailability, setCheckAvailability] = useState(false);

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      username: "",
      darkMode: false,
    },
  });

  // TRPC hooks
  const utils = api.useUtils();
  const { data: userUsername, isLoading: isUserLoading } =
    api.users.get.useQuery();
  const { mutate: updateUser } = api.users.update.useMutation({
    onSuccess: async ({ message }) => {
      await utils.users.invalidate();
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
  // Username availability check
  const username = form.getValues("username");
  const { data: isUsernameAvailable, isLoading: isUsernameAvailableLoading } =
    api.users.getByUsername.useQuery(username ?? skipToken, {
      enabled: checkAvailability && username !== "",
    });

  function onSubmit(values: z.infer<typeof settingsFormSchema>) {
    setIsSaving(true);
    updateUser({
      username: values.username ?? "",
      isDarkmodeAllowed: values.darkMode,
    });
  }

  useEffect(() => {
    if (isUsernameAvailable?.isAvailable === false) {
      form.setError("username", {
        message: isUsernameAvailable.message,
      });
    }
    if (isUsernameAvailable?.isAvailable === true) {
      form.clearErrors("username");
    }
  }, [isUsernameAvailable, form]);

  return (
    <>
      {isUserLoading ? (
        <AboutLoader />
      ) : (
        <Form {...form}>
          <Toaster />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="flex flex-row gap-4">
                    <FormControl>
                      <Input {...field} placeholder={userUsername} />
                    </FormControl>
                    <Button
                      type="button"
                      disabled={field.value === ""}
                      variant={!isUsernameAvailable ? "default" : "outline"}
                      className="w-52 cursor-pointer"
                      onClick={() => {
                        setCheckAvailability(true);
                        setTimeout(() => {
                          setCheckAvailability(false);
                        }, 100);
                      }}
                    >
                      {isUsernameAvailableLoading ? (
                        <IconLoader className="animate-spin" />
                      ) : isUsernameAvailable?.isAvailable === true &&
                        username &&
                        username.length >= 2 ? (
                        <div className="flex flex-row items-center gap-2 text-green-500">
                          <IconCheck /> Available
                        </div>
                      ) : !isUsernameAvailable ? null : (
                        <div className="flex flex-row items-center gap-2 text-red-500">
                          <IconX /> Not Available
                        </div>
                      )}
                      {!isUsernameAvailable && <span>Check Availability</span>}
                    </Button>
                  </div>
                  <FormDescription>
                    This will be used to generate your portfolio site URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Dark Mode</FormLabel>
                    <FormDescription>
                      Enable dark mode for your portfolio site
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
            <Button
              className="cursor-pointer dark:bg-white dark:text-black"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
