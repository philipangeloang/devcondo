"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const ProviderSignout = () => {
  return (
    <Button
      onClick={async () => {
        await signOut({ callbackUrl: "/" });
      }}
      className=""
    >
      Log out
    </Button>
  );
};

export default ProviderSignout;
