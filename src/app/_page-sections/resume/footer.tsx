import Socials from "@/app/_components/blocks/socials";
import Themer from "@/app/_components/blocks/themer";

const Footer = () => {
  return (
    <div className="border-skin-base bg-skin-fill col-span-12 flex w-full items-center justify-between rounded-lg border p-4 shadow-md">
      <Socials />
      <Themer />
    </div>
  );
};

export default Footer;
