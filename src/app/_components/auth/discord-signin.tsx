"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { IconBrandDiscordFilled } from "@tabler/icons-react";

const DiscordSignin = () => {
  // CHANGE CALLBACK URL TO WHERE YOU WANT TO REDIRECT AFTER SIGNIN
  return (
    <Button
      onClick={async () => {
        await signIn("discord", { callbackUrl: "/admin" });
      }}
      className="hover:bg-main-violet flex h-12 w-full cursor-pointer gap-3 bg-[#5869E9]"
    >
      <IconBrandDiscordFilled size={20} />
      <span>Continue with Discord</span>
    </Button>
  );
};

export default DiscordSignin;
