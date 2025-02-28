import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { projectSkills } from "@/server/db/schema";

export const projectSkillsRouter = createTRPCRouter({
  // USE USE STATE TO CATCH THE ID OF WHAT IS BEING EDITED.
  // FIND OUT A WAY TO USE PROJECTSKILLS HERE TO PULL IT IN THE FRONTEND FOR UPDATEING FORM

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
