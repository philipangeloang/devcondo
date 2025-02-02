import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import Brand from "./Brand";
import NavCTA from "./NavCTA";
import Themer from "./Themer";

type LinkItem = {
  title: string;
  href: string;
};

type HamburgerProps = {
  alwaysVisible?: boolean;
  links: LinkItem[];
  showNavCTA?: boolean; // New prop to control NavCTA visibility
};

const Hamburger = ({
  alwaysVisible = false,
  links,
  showNavCTA = true,
}: HamburgerProps) => {
  return (
    <Sheet>
      <SheetTrigger
        className={`${alwaysVisible ? "block" : "block md:hidden"}`}
      >
        <IconMenu2 />
      </SheetTrigger>
      <SheetContent side="left" className="bg-skin-fill w-[275px]">
        <div className="flex flex-col">
          <Brand />
          {links.map((link) => (
            <Link
              key={link.title}
              className="py-4 font-semibold hover:underline"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}

          <div className="mt-3 flex w-full items-center gap-4">
            {/* This is to flag it when a user is already using the dashboard/logged in */}
            {showNavCTA && <NavCTA />}
            <Themer />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Hamburger;
