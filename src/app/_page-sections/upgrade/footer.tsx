"use client";

import Socials from "@/app/_components/blocks/socials";
import Themer from "@/app/_components/blocks/themer";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useTheme } from "next-themes";
const Footer = () => {
  const { setTheme } = useTheme();
  const { data: user } = api.users.get.useQuery();

  if (!user?.isDarkmodeAllowed) {
    setTheme("light");
  }

  return (
    <div
      className={cn(
        "border-skin-base bg-skin-fill z-50 col-span-12 flex w-full max-w-[992px] items-center rounded-lg border p-4 shadow-md sm:fixed sm:bottom-5",
        user?.isDarkmodeAllowed ? "justify-between" : "justify-center",
      )}
    >
      <Socials />
      {user?.isDarkmodeAllowed && <Themer />}
    </div>
  );
};

export default Footer;
