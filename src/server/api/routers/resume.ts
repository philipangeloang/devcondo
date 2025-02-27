import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { resume } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const resumeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1),
        title: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        location: z.string().min(1),
        summary: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(resume).values({
        userId: ctx.session.user.id,
        ...input,
      });

      return { message: "Resume Created" };
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const resumeSingle = await ctx.db.query.resume.findFirst({
      where: (resume, { eq }) => eq(resume.userId, ctx.session.user.id),
    });

    return resumeSingle ?? null;
  }),

  update: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1),
        title: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        location: z.string().min(1),
        summary: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentResume = await ctx.db.query.resume.findFirst({
        where: (resume, { eq }) => eq(resume.userId, ctx.session.user.id),
      });

      const updateData: Partial<typeof resume.$inferInsert> = {};

      if (currentResume && currentResume.fullName !== input.fullName) {
        updateData.fullName = input.fullName;
      }

      if (currentResume && currentResume.title !== input.title) {
        updateData.title = input.title;
      }

      if (currentResume && currentResume.email !== input.email) {
        updateData.email = input.email;
      }

      if (currentResume && currentResume.phone !== input.phone) {
        updateData.phone = input.phone;
      }

      if (currentResume && currentResume.location !== input.location) {
        updateData.location = input.location;
      }

      if (currentResume && currentResume.summary !== input.summary) {
        updateData.summary = input.summary;
      }

      if (Object.keys(updateData).length === 0) {
        return { message: "No changes detected" };
      }

      await ctx.db
        .update(resume)
        .set(updateData)
        .where(eq(resume.userId, ctx.session.user.id));
      return { message: "Resume Updated" };
    }),
});
