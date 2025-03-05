import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { aboutInfo } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const aboutInfoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        title: z.string().min(1).optional(),
        bio: z.string().min(1).optional(),
        profileImage: z.string().url().or(z.literal("")),
        socials: z.object({
          twitter: z.string().url().optional().or(z.literal("")),
          github: z.string().url().optional().or(z.literal("")),
          tiktok: z.string().url().optional().or(z.literal("")),
          instagram: z.string().url().optional().or(z.literal("")),
          youtube: z.string().url().optional().or(z.literal("")),
          linkedin: z.string().url().optional().or(z.literal("")),
          facebook: z.string().url().optional().or(z.literal("")),
          email: z.string().email().optional().or(z.literal("")),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(aboutInfo).values({
        userId: ctx.session.user.id,
        ...input,
      });

      return { message: "Profile created successfully" };
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const aboutInfoSingle = await ctx.db.query.aboutInfo.findFirst({
      where: (aboutInfo, { eq }) => eq(aboutInfo.userId, ctx.session.user.id),
    });

    return aboutInfoSingle ?? null;
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        title: z.string().min(1).optional(),
        bio: z.string().min(1).optional(),
        profileImage: z.string().url().optional().or(z.literal("")),
        socials: z.object({
          twitter: z.string().url().optional().or(z.literal("")),
          github: z.string().url().optional().or(z.literal("")),
          tiktok: z.string().url().optional().or(z.literal("")),
          instagram: z.string().url().optional().or(z.literal("")),
          youtube: z.string().url().optional().or(z.literal("")),
          linkedin: z.string().url().optional().or(z.literal("")),
          facebook: z.string().url().optional().or(z.literal("")),
          email: z.string().email().optional().or(z.literal("")),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentAboutInfo = await ctx.db.query.aboutInfo.findFirst({
        where: (aboutInfo, { eq }) => eq(aboutInfo.userId, ctx.session.user.id),
      });

      const updateData: Partial<typeof aboutInfo.$inferInsert> = {};

      if (currentAboutInfo && currentAboutInfo.name !== input.name) {
        updateData.name = input.name;
      }

      if (currentAboutInfo && currentAboutInfo.title !== input.title) {
        updateData.title = input.title;
      }

      if (currentAboutInfo && currentAboutInfo.bio !== input.bio) {
        updateData.bio = input.bio;
      }

      if (
        currentAboutInfo &&
        currentAboutInfo.profileImage !== input.profileImage
      ) {
        updateData.profileImage = input.profileImage;
      }

      const updatedSocials = { ...currentAboutInfo?.socials };

      Object.keys(input.socials).forEach((key) => {
        const socialKey = key as keyof typeof input.socials;
        if (input.socials[socialKey] !== updatedSocials[socialKey]) {
          updatedSocials[socialKey] = input.socials[socialKey];
        }
      });

      // Check if socials actually changed
      if (
        JSON.stringify(updatedSocials) !==
        JSON.stringify(currentAboutInfo?.socials)
      ) {
        updateData.socials = updatedSocials;
      }

      if (Object.keys(updateData).length === 0) {
        return { message: "No changes detected" };
      }

      // Only update if there's something to change

      await ctx.db
        .update(aboutInfo)
        .set(updateData)
        .where(eq(aboutInfo.userId, ctx.session.user.id));
      return { message: "Profile updated successfully" };
    }),
});
