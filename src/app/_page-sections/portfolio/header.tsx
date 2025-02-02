import Hamburger from "@/app/_components/blocks/Hamburger";

const links = [
  { title: "Home", href: "/home" },
  { title: "Projects", href: "/projects" },
  { title: "Resume", href: "/resume" },
];

const Header = () => {
  return (
    <div className="border-skin-base bg-skin-fill col-span-12 flex w-full items-center justify-between rounded-lg border p-4 shadow-md">
      <h3 className="text-2xl font-bold">Philip</h3>
      <Hamburger alwaysVisible links={links} showNavCTA={false} />
    </div>
  );
};

export default Header;
