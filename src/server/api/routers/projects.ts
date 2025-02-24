/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { projects, projectSkills } from "@/server/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export const projectsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const allProjects = await ctx.db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.userId, ctx.session.user.id),
    });

    return allProjects ?? null;
  }),

  getProjectsWithSkills: protectedProcedure.query(async ({ ctx }) => {
    const allProjectsWithSkills = await ctx.db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.userId, ctx.session.user.id),
      with: {
        skills: { with: { skill: true } },
      },
    });

    return allProjectsWithSkills ?? null;

    //   where: (projects, { eq }) => eq(projects.userId, ctx.session.user.id),
    // });

    // const projectSkills = await ctx.db.query.projectSkills.findMany({
    //   where: (projectSkills, { in: $in }) => $in(projectSkills.projectId, allProjects.map((project) => project.id)),
    // });

    // const skills = await ctx.db.query.skills.findMany({
    //   where: (skills, { in: $in }) => $in(skills.id, projectSkills.map((projectSkill) => projectSkill.skillId)),
    // });

    // const projectsWithSkills = allProjects.map((project) => {
    //   const projectSkillIds = projectSkills.filter((projectSkill) => projectSkill.projectId === project.id).map((projectSkill) => projectSkill.skillId);
    //   const projectSkills = skills.filter((skill) => projectSkillIds.includes(skill.id));
    //   return {
    //     ...project,
    //     skills: projectSkills,
    //   };
    // });

    // return projectsWithSkills ?? null;
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2),
        description: z.string().min(2),
        imageUrl: z.string().url(),
        projectUrl: z.string().url().optional().default(""),
        skillIds: z.array(z.number()).nonempty(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { skillIds } = input;
      const newProjectId = await ctx.db
        .insert(projects)
        .values({
          userId: ctx.session.user.id,
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          projectUrl: input.projectUrl,
        })
        .returning({ id: projects.id });

      if (newProjectId[0]?.id) {
        await ctx.db.insert(projectSkills).values(
          skillIds.map((skillId) => ({
            projectId: newProjectId[0]?.id ?? 0,
            skillId: skillId,
          })),
        );
      }

      return { message: "Project created" };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(2),
        description: z.string().min(2),
        imageUrl: z.string().url(),
        projectUrl: z.string().url().optional().default(""),
        skillIds: z.array(z.number()).nonempty(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { skillIds } = input;
      const existingProject = await ctx.db.query.projects.findFirst({
        where: (projects, { and, eq }) =>
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.session.user.id),
          ),
      });

      const existingProjectSkills = await ctx.db.query.projectSkills.findMany({
        where: (projectSkills, { eq }) => eq(projectSkills.projectId, input.id),
      });

      const existingSkillIds = existingProjectSkills.map((ps) => ps.skillId);
      const skillsToAdd = skillIds.filter(
        (id) => !existingSkillIds.includes(id),
      ); //If the skill is not in the existing skillIds, add it
      const skillsToRemove = existingSkillIds.filter(
        (id) => !skillIds.includes(id),
      ); //If the skill is not in the new skillIds, remove it

      // Updating Project Details Except the Skills
      const updateData: Partial<typeof projects.$inferInsert> = {};

      if (existingProject && existingProject.title !== input.title) {
        updateData.title = input.title;
      }
      if (
        existingProject &&
        existingProject.description !== input.description
      ) {
        updateData.description = input.description;
      }
      if (existingProject && existingProject.imageUrl !== input.imageUrl) {
        updateData.imageUrl = input.imageUrl;
      }
      if (existingProject && existingProject.projectUrl !== input.projectUrl) {
        updateData.projectUrl = input.projectUrl;
      }

      if (
        Object.keys(updateData).length === 0 &&
        skillsToAdd.length === 0 &&
        skillsToRemove.length === 0
      ) {
        return { message: "No changes detected" };
      }

      // Inserting New Skills
      if (skillsToAdd.length > 0) {
        await ctx.db.insert(projectSkills).values(
          skillsToAdd.map((skillId) => ({
            projectId: input.id,
            skillId: skillId,
          })),
        );
      }

      // Removing Skills
      if (skillsToRemove.length > 0) {
        await ctx.db
          .delete(projectSkills)
          .where(
            and(
              eq(projectSkills.projectId, input.id),
              inArray(projectSkills.skillId, skillsToRemove),
            ),
          );
      }

      if (Object.keys(updateData).length > 0) {
        await ctx.db
          .update(projects)
          .set(updateData)
          .where(
            and(
              eq(projects.id, input.id),
              eq(projects.userId, ctx.session.user.id),
            ),
          );
      }

      return { message: "Project updated" };
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projects)
        .where(
          and(eq(projects.id, input), eq(projects.userId, ctx.session.user.id)),
        );
    }),
});
