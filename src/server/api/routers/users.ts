import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    return {
      username: user?.username ?? "",
      isDarkmodeAllowed: user?.isDarkmodeAllowed ?? false,
      isDeployed: user?.isDeployed ?? false,
      isResumePublic: user?.isResumePublic ?? false,
    };
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

  updateUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { username } = input;

      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      if (user.username === username) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No changes made",
        });
      }

      if (username.length < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username must be at least 2 characters",
        });
      }

      if (username === "admin" || username === "settings") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is reserved",
        });
      }

      // update username when all checks are passed
      await ctx.db
        .update(users)
        .set({
          username,
        })
        .where(eq(users.id, ctx.session.user.id));

      return {
        message: "User updated successfully",
      };
    }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        isDarkmodeAllowed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { isDarkmodeAllowed } = input;

      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      if (isDarkmodeAllowed === user.isDarkmodeAllowed) {
        return {
          message: "No changes made",
        };
      }

      await ctx.db
        .update(users)
        .set({ isDarkmodeAllowed })
        .where(eq(users.id, ctx.session.user.id));

      return {
        message: "Settings updated successfully",
      };
    }),

  updateDeployed: protectedProcedure
    .input(z.object({ isDeployed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      let { isDeployed } = input;

      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      if (user.isDeployed === true) {
        isDeployed = false;
      } else {
        isDeployed = true;
      }

      await ctx.db
        .update(users)
        .set({ isDeployed })
        .where(eq(users.id, ctx.session.user.id));

      if (isDeployed === true) {
        return {
          message: "Deployed successfully",
        };
      } else {
        return {
          message: "Undeployed successfully",
        };
      }
    }),
});
