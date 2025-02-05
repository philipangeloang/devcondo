"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Separator } from "@/app/_components/ui/separator";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import Brand from "./brand";
import Themer from "./themer";
import NavCTA from "./nav-cta";

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
  brand = <Brand />, // Default to <Brand /> if no customBrand is provide
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
        <SheetTitle className="sr-only"></SheetTitle>{" "}
        {/* Hide title from screen readers to avoid errors */}
        <div className="flex items-center justify-between">
          {brand} {/* Render custom brand if provided */}
        </div>
        <Separator className="my-4" />
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
