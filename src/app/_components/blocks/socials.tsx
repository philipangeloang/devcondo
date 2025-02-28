"use client";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandFacebook,
  IconMail,
} from "@tabler/icons-react";
import { api } from "@/trpc/react";

const Socials = () => {
  //TRPC Hooks
  const { data: aboutInfo } = api.aboutInfo.get.useQuery();

  return (
    <div className="flex gap-2">
      {aboutInfo?.socials?.twitter && (
        <a
          href={aboutInfo?.socials?.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconBrandX
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </a>
      )}
      {aboutInfo?.socials?.instagram && (
        <a
          href={aboutInfo?.socials?.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconBrandInstagram
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </a>
      )}
      {aboutInfo?.socials?.github && (
        <a
          href={aboutInfo?.socials?.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconBrandGithub
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </a>
      )}
      {aboutInfo?.socials?.linkedin && (
        <a
          href={aboutInfo?.socials?.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconBrandLinkedin
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </a>
      )}
      {aboutInfo?.socials?.youtube && (
        <a
          href={aboutInfo?.socials?.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconBrandYoutube
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </a>
      )}
      {aboutInfo?.socials?.tiktok && (
        <a
          href={aboutInfo?.socials?.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconBrandTiktok
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </a>
      )}
      {aboutInfo?.socials?.facebook && (
        <a
          href={aboutInfo?.socials?.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconBrandFacebook
            size="36"
            className="bg-skin-fill-accent rounded-lg p-2"
          />
        </a>
      )}
      {aboutInfo?.socials?.email && (
        <a
          href={`mailto:${aboutInfo?.socials?.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <IconMail size="36" className="bg-skin-fill-accent rounded-lg p-2" />
        </a>
      )}
    </div>
  );
};

export default Socials;
