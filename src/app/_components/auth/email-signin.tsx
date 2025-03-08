/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { signIn } from "next-auth/react";
import { IconMailFilled } from "@tabler/icons-react";

const formSchema = z.object({
  email: z.string().email().min(1, {
    message: "Please Enter Your Email",
  }),
});

const EmailSignin = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.email);
    const email = values.email;
    await signIn("email", { email, callbackUrl: "/auth-callback" });
  }

  return (
    // CHANGE CALLBACK URL TO WHERE YOU WANT TO REDIRECT AFTER SIGNIN
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          type="submit"
          className="hover:bg-main-violet flex h-12 w-full cursor-pointer gap-3 border border-black/10"
        >
          <IconMailFilled size={20} color="black" />
          <span className="text-black">Continue with Email</span>
        </Button>
      </form>
    </Form>
  );
};

export default EmailSignin;
