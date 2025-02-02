"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";
import { IconMoon, IconSunFilled } from "@tabler/icons-react";

const Themer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="aspect-square cursor-pointer bg-white p-1 dark:bg-black"
      variant="ghost"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
    >
      {theme === "light" ? <IconMoon /> : <IconSunFilled />}
    </Button>
  );
};
export default Themer;
