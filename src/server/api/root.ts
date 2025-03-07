import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { aboutInfoRouter } from "./routers/about-info";
import { projectsRouter } from "./routers/projects";
import { skillsRouter } from "./routers/skills";
import { projectSkillsRouter } from "./routers/project-skills";
import { resumeRouter } from "./routers/resume";
import { experiencesRouter } from "./routers/experiences";
import { educationRouter } from "./routers/education";
import { certificationsRouter } from "./routers/certifications";
import { usersRouter } from "./routers/users";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  aboutInfo: aboutInfoRouter,
  project: projectsRouter,
  skill: skillsRouter,
  projectSkills: projectSkillsRouter,
  resume: resumeRouter,
  experiences: experiencesRouter,
  education: educationRouter,
  certifications: certificationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
