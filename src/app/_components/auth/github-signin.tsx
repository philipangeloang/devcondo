"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { IconBrandGithubFilled } from "@tabler/icons-react";

const GithubSignin = () => {
  // CHANGE CALLBACK URL TO WHERE YOU WANT TO REDIRECT AFTER SIGNIN
  return (
    <Button
      onClick={async () => {
        await signIn("github", { callbackUrl: "/auth-callback" });
      }}
      className="hover:bg-main-violet flex h-12 w-full cursor-pointer gap-3 bg-black"
    >
      <IconBrandGithubFilled size={20} />
      <span>Continue with Github</span>
    </Button>
  );
};

export default GithubSignin;
