/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { projects } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const projectsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const allProjects = await ctx.db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.userId, ctx.session.user.id),
    });

    return allProjects ?? null;
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2),
        description: z.string().min(2),
        imageUrl: z.string().url(),
        technologies: z.array(z.string().min(1)).optional(),
        projectUrl: z.string().url().optional().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(projects).values({
        userId: ctx.session.user.id,
        ...input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(2),
        description: z.string().min(2),
        imageUrl: z.string().url(),
        technologies: z.array(z.string().min(1)).optional(),
        projectUrl: z.string().url().optional().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projects)
        .set(input)
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.session.user.id),
          ),
        );
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projects)
        .where(
          and(eq(projects.id, input), eq(projects.userId, ctx.session.user.id)),
        );
    }),
});
