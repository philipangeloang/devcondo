import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { experiences } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const experiencesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        resumeId: z.number(),
        title: z.string().min(2),
        company: z.string().min(2),
        startDate: z.string().min(2),
        endDate: z.string().optional(),
        description: z.string().min(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(experiences).values({
        resumeId: input.resumeId,
        title: input.title,
        company: input.company,
        startDate: input.startDate,
        endDate: input.endDate,
        description: input.description,
      });

      return { message: "Experience Created" };
    }),

  getByResumeId: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const experiencesList = await ctx.db.query.experiences.findMany({
        where: (experiences, { eq }) => eq(experiences.resumeId, input),
        orderBy: (experiences, { desc }) => [desc(experiences.startDate)],
      });

      return experiencesList;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(2),
        company: z.string().min(2),
        startDate: z.string().min(2),
        endDate: z.string().optional(),
        description: z.string().min(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentExperience = await ctx.db.query.experiences.findFirst({
        where: (experiences, { eq }) => eq(experiences.id, input.id),
      });

      const updateData: Partial<typeof experiences.$inferInsert> = {};

      if (currentExperience && currentExperience.title !== input.title) {
        updateData.title = input.title;
      }

      if (currentExperience && currentExperience.company !== input.company) {
        updateData.company = input.company;
      }

      if (
        currentExperience &&
        currentExperience.startDate !== input.startDate
      ) {
        updateData.startDate = input.startDate;
      }

      if (currentExperience && currentExperience.endDate !== input.endDate) {
        updateData.endDate = input.endDate;
      }

      if (
        currentExperience &&
        currentExperience.description !== input.description
      ) {
        updateData.description = input.description;
      }

      if (Object.keys(updateData).length === 0) {
        return { message: "No changes detected" };
      }

      // Only update if there's something to change

      await ctx.db
        .update(experiences)
        .set(updateData)
        .where(eq(experiences.id, input.id));

      return { message: "Experience Updated" };
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(experiences).where(eq(experiences.id, input));

      return { message: "Experience Deleted" };
    }),
});
