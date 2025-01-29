import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Brand from "../../_components/blocks/Brand";
import { Separator } from "../../_components/ui/separator";

const Footer = () => {
  return (
    <section className="w-full bg-[#f2f1d8] py-5 dark:bg-[#0f0f0f] md:py-10">
      <div className="mx-auto flex max-w-screen-xl flex-col p-4">
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
          <div className="flex w-[320px] flex-col items-center justify-center gap-4 md:items-start">
            <Brand />
            <p className="text-center text-sm md:text-left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              malesuada, nunc nec auctor lacinia, libero odio ultricies libero,
              nec vulputate mi felis nec ert.
            </p>
          </div>

          <div className="my-8 flex flex-col gap-3 text-center md:my-0 md:text-left">
            <h1 className="text-sm font-bold uppercase tracking-wider">
              Links
            </h1>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="leading-7">Pricing</li>
              <li className="leading-7">Features</li>
              <li className="leading-7">Contact</li>
            </ul>
          </div>

          <div className="my-8 flex flex-col gap-3 text-center md:my-0 md:text-left">
            <h1 className="text-sm font-bold uppercase tracking-wider">More</h1>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="leading-7">Project 1</li>
              <li className="leading-7">Project 2</li>
              <li className="leading-7">Project 3</li>
              <li className="leading-7">Project 4</li>
              <li className="leading-7">Project 5</li>
              <li className="leading-7">Project 6</li>
            </ul>
          </div>

          <div className="my-8 flex flex-col gap-3 text-center md:my-0 md:text-left">
            <h1 className="text-sm font-bold uppercase tracking-wider">
              Legal
            </h1>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="leading-7">Link1</li>
              <li className="leading-7">Link1</li>
              <li className="leading-7">Link1</li>
            </ul>
          </div>
        </div>

        <Separator className="my-5 bg-black dark:bg-white" />

        <div className="flex flex-col-reverse items-center justify-between gap-4 text-xs sm:flex-row">
          <div className="font-medium">
            Copyright © 2024 All Rights Reserved
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
          <div className="flex gap-5">
            <IconBrandX />
            <IconBrandInstagram />
            <IconBrandGithub />
            <IconBrandLinkedin />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
