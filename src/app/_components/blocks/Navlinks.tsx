import Link from "next/link";
import { Button } from "../ui/button";

const links = [
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Contact", href: "#contact" },
];

const Navlinks = () => {
  return (
    <div className="hidden md:flex md:items-center md:gap-3">
      {links.map((link) => (
        <Button asChild variant="link" key={link.title}>
          <Link href={link.href}>{link.title}</Link>
        </Button>
      ))}
    </div>
  );
};

export default Navlinks;
