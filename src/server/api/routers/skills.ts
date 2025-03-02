import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { skills } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const skillsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(skills).values({
        userId: ctx.session.user.id,
        ...input,
      });
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const skill = await ctx.db.query.skills.findMany({
      where: (skills, { eq }) => eq(skills.userId, ctx.session.user.id),
    });

    return skill ?? null;
  }),

  getActive: protectedProcedure.query(async ({ ctx }) => {
    const skill = await ctx.db.query.skills.findMany({
      where: (skills, { eq, and }) =>
        and(eq(skills.userId, ctx.session.user.id), eq(skills.isActive, true)),
    });

    return skill ?? null;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(skills)
        .set({
          name: input.name,
          isActive: input.isActive,
        })
        .where(
          and(eq(skills.id, input.id), eq(skills.userId, ctx.session.user.id)),
        );
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(skills)
        .where(
          and(eq(skills.id, input), eq(skills.userId, ctx.session.user.id)),
        );
    }),
});
