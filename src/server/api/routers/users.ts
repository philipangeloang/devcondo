import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  updateUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ username: input.username })
        .where(eq(users.id, ctx.session.user.id));
    }),
});

// NEED TO CHECK UNIQUENESS
