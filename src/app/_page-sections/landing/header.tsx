import Brand from "@/app/_components/blocks/brand";
import Hamburger from "@/app/_components/blocks/hamburger";
import NavCTA from "@/app/_components/blocks/nav-cta";
import Navlinks from "@/app/_components/blocks/nav-links";
import Themer from "@/app/_components/blocks/themer";

const links = [
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Contact", href: "#contact" },
];

const Header = () => {
  return (
    <section className="w-full">
      <nav className="mx-auto flex max-w-(--breakpoint-xl) justify-between p-4">
        <Brand />
        <Hamburger links={links} />
        <Navlinks />
        <div className="hidden md:flex md:items-center md:gap-3">
          <NavCTA />
          <Themer />
        </div>
      </nav>
    </section>
  );
};

export default Header;
