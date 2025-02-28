import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { education } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const educationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        resumeId: z.number(),
        degree: z.string().min(2),
        university: z.string().min(2),
        startDate: z.string().min(2),
        endDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(education).values({
        resumeId: input.resumeId,
        degree: input.degree,
        university: input.university,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      return { message: "Education Created" };
    }),

  getByResumeId: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const educationList = await ctx.db.query.education.findMany({
        where: (education, { eq }) => eq(education.resumeId, input),
        orderBy: (education, { desc }) => [desc(education.startDate)],
      });

      return educationList;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        degree: z.string().min(2),
        university: z.string().min(2),
        startDate: z.string().min(2),
        endDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentEducation = await ctx.db.query.education.findFirst({
        where: (education, { eq }) => eq(education.id, input.id),
      });

      const updateData: Partial<typeof education.$inferInsert> = {};

      if (currentEducation && currentEducation.degree !== input.degree) {
        updateData.degree = input.degree;
      }

      if (
        currentEducation &&
        currentEducation.university !== input.university
      ) {
        updateData.university = input.university;
      }

      if (currentEducation && currentEducation.startDate !== input.startDate) {
        updateData.startDate = input.startDate;
      }

      if (currentEducation && currentEducation.endDate !== input.endDate) {
        updateData.endDate = input.endDate;
      }

      if (Object.keys(updateData).length === 0) {
        return { message: "No changes detected" };
      }

      await ctx.db
        .update(education)
        .set(updateData)
        .where(eq(education.id, input.id));

      return { message: "Education Updated" };
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(education).where(eq(education.id, input));

      return { message: "Education Deleted" };
    }),
});
