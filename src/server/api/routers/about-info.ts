import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { aboutInfo } from "@/server/db/schema";

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
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
