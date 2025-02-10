import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { projects } from "@/server/db/schema";

export const projectsRouter = createTRPCRouter({
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
});
