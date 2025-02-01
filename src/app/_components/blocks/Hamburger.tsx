import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import Brand from "./Brand";
import NavCTA from "./NavCTA";
import Themer from "./Themer";

const links = [
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Contact", href: "#contact" },
];

const Hamburger = () => {
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
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
            <NavCTA />
            <Themer />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Hamburger;
