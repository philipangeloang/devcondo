import Themer from "@/app/_components/blocks/Themer";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <div className="border-skin-base bg-skin-fill col-span-12 flex w-full items-center justify-between rounded-lg border p-4 shadow-md">
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
      <Themer />
    </div>
  );
};

export default Footer;
