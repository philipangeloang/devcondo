"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

const GoogleSignin = () => {
  // CHANGE CALLBACK URL TO WHERE YOU WANT TO REDIRECT AFTER SIGNIN
  return (
    <Button
      onClick={async () => {
        await signIn("google", { callbackUrl: "/admin" });
      }}
      className="hover:bg-main-violet flex h-12 w-full gap-3 bg-[#E74133]"
    >
      <IconBrandGoogleFilled size={20} />
      <span>Continue with Google</span>
    </Button>
  );
};

export default GoogleSignin;
