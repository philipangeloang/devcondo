import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { projects } from "@/server/db/schema";

export const projectsRouter = createTRPCRouter({
  //   create: protectedProcedure
  //     .input(
  //       z.object({
  //         title: z.string().min(1),
  //         description: z.string().min(1),
  //         imageUrl: z.string().url(),
  //       }),
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       await ctx.db.insert(projects).values({
  //         userId: ctx.session.user.id,
  //         ...input,
  //       });
  //     }),
});
