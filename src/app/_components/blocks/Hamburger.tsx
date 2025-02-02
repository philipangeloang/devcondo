"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import Brand from "./Brand";
import Themer from "./Themer";
import NavCTA from "./NavCTA";

type LinkItem = {
  title: string;
  href: string;
};

type HamburgerProps = {
  alwaysVisible?: boolean;
  links: LinkItem[];
  showNavCTA?: boolean;
  brand?: JSX.Element; // Custom brand component
};

const Hamburger = ({
  alwaysVisible = false,
  links,
  showNavCTA = true,
  brand = <Brand />, // Default to <Brand /> if no customBrand is provided
}: HamburgerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={`${alwaysVisible ? "block" : "block md:hidden"} focus:outline-none`}
      >
        <IconMenu2 className="text-skin-base h-7 w-7" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-skin-fill w-[280px] p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          {brand} {/* Render custom brand if provided */}
        </div>

        <Separator className="my-4" />

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hover:text-primary text-lg font-medium transition-colors"
              onClick={() => setOpen(false)} // Close menu on link click
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* CTA BUTTONS & THEMING */}
        <div className="mt-auto flex flex-col gap-4 pt-6">
          {showNavCTA && <NavCTA />}
          <Themer />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Hamburger;
