import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const projectSkillsRouter = createTRPCRouter({
  getUpdateFormSkill: protectedProcedure
    .input(z.number().default(0))
    .query(async ({ ctx, input }) => {
      const relativeSkills = await ctx.db.query.projectSkills
        .findMany({
          where: (projectSkills, { eq }) => eq(projectSkills.projectId, input),
        })
        .then((skills) => {
          return skills.map((skill) => skill.skillId); // Extract only the skillId
        });

      return relativeSkills ?? null;
    }),
});
