import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";

export const usersRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    return user?.username ?? "";
  }),

  getByUsername: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, input),
      });

      // Reserved usernames
      if (input === "admin" || input === "settings") {
        return {
          isAvailable: false,
          message: "Username is reserved",
        };
      }

      // Username must be at least 2 characters
      if (input.length < 2) {
        return {
          isAvailable: false,
          message: "Username must be at least 2 characters.",
        };
      }

      // Username must be available
      if (user) {
        return {
          isAvailable: false,
          message: "Username already taken",
        };
      }

      return {
        isAvailable: true,
        message: "Username is available",
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        isDarkmodeAllowed: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { username, isDarkmodeAllowed } = input;

      await ctx.db
        .update(users)
        .set({
          username,
          isDarkmodeAllowed,
        })
        .where(eq(users.id, ctx.session.user.id));

      return {
        message: "User updated successfully",
      };
    }),
});
