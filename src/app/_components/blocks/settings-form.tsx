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

const userNameFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .optional(),
});

const settingsFormSchema = z.object({
  darkMode: z.boolean().default(false),
});

export function SettingsForm() {
  // States
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [checkAvailability, setCheckAvailability] = useState(false);

  const userNameForm = useForm<z.infer<typeof userNameFormSchema>>({
    resolver: zodResolver(userNameFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const settingsForm = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      darkMode: false,
    },
  });

  // TRPC hooks
  const utils = api.useUtils();
  const { data: user, isLoading: isUserLoading } = api.users.get.useQuery();
  const { mutate: updateUsername } = api.users.updateUsername.useMutation({
    onSuccess: async ({ message }) => {
      await utils.users.invalidate();
      setIsSavingUsername(false);
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async ({ message }) => {
      setIsSavingUsername(false);
      userNameForm.setError("username", {
        message,
      });
    },
  });
  const { mutate: updateSettings } = api.users.updateSettings.useMutation({
    onSuccess: async ({ message }) => {
      await utils.users.invalidate();
      setIsSavingSettings(false);
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async ({ message }) => {
      setIsSavingSettings(false);
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
  });

  // Username availability check
  const username = userNameForm.getValues("username");
  const { data: isUsernameAvailable, isLoading: isUsernameAvailableLoading } =
    api.users.getByUsername.useQuery(username ?? skipToken, {
      enabled: checkAvailability && username !== "",
    });

  function onSubmit(values: z.infer<typeof userNameFormSchema>) {
    setIsSavingUsername(true);
    updateUsername({
      username: values.username ?? "",
    });
  }

  function onSettingsSubmit(values: z.infer<typeof settingsFormSchema>) {
    setIsSavingSettings(true);
    updateSettings({
      isDarkmodeAllowed: values.darkMode,
    });
  }

  useEffect(() => {
    if (isUsernameAvailable?.isAvailable === false) {
      userNameForm.setError("username", {
        message: isUsernameAvailable.message,
      });
    }
    if (isUsernameAvailable?.isAvailable === true) {
      userNameForm.clearErrors("username");
    }
    settingsForm.reset({
      darkMode: user?.isDarkmodeAllowed ?? false,
    });
  }, [isUsernameAvailable, userNameForm, settingsForm, user]);

  return (
    <>
      {isUserLoading ? (
        <AboutLoader />
      ) : (
        <div className="flex flex-col gap-4">
          <Toaster />

          <div className="rounded-lg border p-4">
            <Form {...userNameForm}>
              <form
                onSubmit={userNameForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={userNameForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <div className="flex flex-row gap-4">
                        <FormControl>
                          <Input {...field} placeholder={user?.username} />
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
                          {!isUsernameAvailable && (
                            <span>Check Availability</span>
                          )}
                        </Button>
                      </div>
                      <FormDescription>
                        This will be used to generate your portfolio site URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="cursor-pointer dark:bg-white dark:text-black"
                  disabled={isSavingUsername}
                  type="submit"
                >
                  {isSavingUsername ? "Saving..." : "Save Username"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="rounded-lg border p-4">
            <Form {...settingsForm}>
              <form
                className="space-y-4"
                onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
              >
                <FormField
                  control={settingsForm.control}
                  name="darkMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
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
                  disabled={isSavingSettings}
                  type="submit"
                >
                  {isSavingSettings ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
