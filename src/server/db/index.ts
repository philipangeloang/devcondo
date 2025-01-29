// NEON SERVERLESS

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";
import { env } from "@/env";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema, logger: true });

/* 
USING POSTGRES PACKAGE USES TCP CONNECTION.
TCP CONNECTION POOLING IS A TRADITIONAL WAY OF CONNECTING TO A DATABASE
AND IT'S NOT RECOMMENDED FOR SERVERLESS APPLICATIONS.
BUT IF YOU ARE USING A NON-SERVERLESS APPLICATION
YOU CAN USE THE SNIPPET BELOW INSTEAD OF THE ONE ABOVE.
*/

// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

//
// import * as schema from "./schema";

// /**
//  * Cache the database connection in development. This avoids creating a new connection on every HMR
//  * update.
//  */
// const globalForDb = globalThis as unknown as {
//   conn: postgres.Sql | undefined;
// };

// const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
// if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// export const db = drizzle(conn, { schema, logger: true });
