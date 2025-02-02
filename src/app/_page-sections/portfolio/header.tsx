import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

const Header = () => {
  return (
    <div className="border-skin-base col-span-12 flex items-center justify-between rounded-lg border p-4">
      <h3 className="text-2xl font-bold">Philip</h3>
      <ul className="flex gap-8">
        <li>Home</li>
        <li>Projects</li>
        <li>Resume</li>
      </ul>
      <div className="flex gap-2">
        <IconBrandX size="36" className="bg-skin-fill-accent rounded-lg p-2" />
        <IconBrandInstagram
          size="36"
          className="bg-skin-fill-accent rounded-lg p-2"
        />
        <IconBrandGithub
          size="36"
          className="bg-skin-fill-accent rounded-lg p-2"
        />
        <IconBrandLinkedin
          size="36"
          className="bg-skin-fill-accent rounded-lg p-2"
        />
      </div>
    </div>
  );
};

export default Header;
