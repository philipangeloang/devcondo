import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { certifications } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const certificationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        resumeId: z.number(),
        title: z.string().min(2),
        yearAwarded: z.string().length(4),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(certifications).values({
        resumeId: input.resumeId,
        title: input.title,
        yearAwarded: input.yearAwarded,
      });

      return { message: "Certification Created" };
    }),

  getByResumeId: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const certificationsList = await ctx.db.query.certifications.findMany({
        where: (certifications, { eq }) => eq(certifications.resumeId, input),
        orderBy: (certifications, { desc }) => [
          desc(certifications.yearAwarded),
        ],
      });

      return certificationsList;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(2),
        yearAwarded: z.string().length(4),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentCertification = await ctx.db.query.certifications.findFirst({
        where: (certifications, { eq }) => eq(certifications.id, input.id),
      });

      const updateData: Partial<typeof certifications.$inferInsert> = {};

      if (currentCertification && currentCertification.title !== input.title) {
        updateData.title = input.title;
      }

      if (
        currentCertification &&
        currentCertification.yearAwarded !== input.yearAwarded
      ) {
        updateData.yearAwarded = input.yearAwarded;
      }

      if (Object.keys(updateData).length === 0) {
        return { message: "No changes detected" };
      }

      await ctx.db
        .update(certifications)
        .set(updateData)
        .where(eq(certifications.id, input.id));

      return { message: "Certification Updated" };
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(certifications).where(eq(certifications.id, input));

      return { message: "Certification Deleted" };
    }),
});
