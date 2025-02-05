import Hamburger from "@/app/_components/blocks/hamburger";

const links = [
  { title: "Home", href: "/admin" },
  { title: "Projects", href: "/user/projects" },
  { title: "Resume", href: "/user/resume" },
];

const Header = () => {
  return (
    <div className="border-skin-base bg-skin-fill col-span-12 flex w-full items-center justify-between rounded-lg border p-4 shadow-md">
      <h3 className="text-2xl font-bold">Philip</h3>
      <Hamburger
        alwaysVisible
        links={links}
        showNavCTA={false}
        brand={<h1 className="text-2xl font-bold">Philip</h1>}
      />
    </div>
  );
};

export default Header;
