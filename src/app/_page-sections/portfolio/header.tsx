import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

const Header = () => {
  return (
    <div className="border-skin-base bg-skin-fill col-span-12 flex w-full items-center justify-between rounded-lg border p-4 shadow-md">
      <h3 className="text-2xl font-bold">Philip</h3>
      <ul className="flex gap-8">
        <li>Home</li>
        <li>Projects</li>
        <li>Resume</li>
      </ul>
    </div>
  );
};

export default Header;
