import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { aboutInfoRouter } from "./routers/about-info";
import { projectsRouter } from "./routers/projects";
import { skillsRouter } from "./routers/skills";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  aboutInfo: aboutInfoRouter,
  project: projectsRouter,
  skill: skillsRouter,
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
