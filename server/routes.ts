import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { leaderboard, insertLeaderboardSchema } from "@shared/schema";
import { asc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Leaderboard API Routes (stuff)
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const entries = await db
        .select()
        .from(leaderboard)
        .orderBy(asc(leaderboard.completionTime))
        .limit(10);

      res.json(entries);
    } catch (error: any) {
      console.error("Detailed error fetching leaderboard:", error);
      res.status(500).json({
        error: "Failed to fetch leaderboard",
        details: error.message || error.toString(),
      });
    }
  });

  app.post("/api/leaderboard", async (req, res) => {
    try {
      const validatedData = insertLeaderboardSchema.parse(req.body);

      const [entry] = await db
        .insert(leaderboard)
        .values(validatedData)
        .returning();

      res.json(entry);
    } catch (error) {
      console.error("Error saving leaderboard entry:", error);
      res.status(500).json({ error: "Failed to save leaderboard entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
