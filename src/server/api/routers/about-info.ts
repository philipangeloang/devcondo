import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { aboutInfo } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const aboutInfoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        title: z.string().min(1),
        bio: z.string().min(1),
        profileImage: z.string().url(),
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
        profileImage: z.string().url().optional(),
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
      await ctx.db
        .update(aboutInfo)
        .set(input)
        .where(eq(aboutInfo.userId, ctx.session.user.id));
    }),
});
