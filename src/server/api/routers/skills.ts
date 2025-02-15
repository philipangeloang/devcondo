import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { skills } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const skillsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(skills)
        .set({
          name: input.name,
        })
        .where(eq(skills.userId, ctx.session.user.id));
    }),
});
