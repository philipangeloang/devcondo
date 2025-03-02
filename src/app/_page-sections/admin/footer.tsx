import Socials from "@/app/_components/blocks/socials";
import Themer from "@/app/_components/blocks/themer";

const Footer = () => {
  return (
    <div className="border-skin-base bg-skin-fill z-50 col-span-12 flex w-full max-w-[992px] items-center justify-between rounded-lg border p-4 shadow-md sm:fixed sm:bottom-5">
      <Socials />
      <Themer />
    </div>
  );
};

export default Footer;
