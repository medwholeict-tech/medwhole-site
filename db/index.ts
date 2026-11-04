// Ensure environment variables are loaded
if (typeof window === "undefined") {
  // Only load dotenv on server-side
  try {
    require("dotenv").config();
  } catch (e) {
    // dotenv not available, skip
  }
}

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Load from .env or .env.local.
// SECURITY: never fall back to NEXT_PUBLIC_* names - variables with that prefix
// get inlined into the browser bundle and would leak the connection string.
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
