import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConsultationSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Consultation booking endpoint
  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid consultation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create consultation" });
      }
    }
  });

  // Get all consultations
  app.get("/api/consultations", async (req, res) => {
    try {
      const consultations = await storage.getConsultations();
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Get gear products
  app.get("/api/gear", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getGearProductsByCategory(category);
      } else {
        products = await storage.getGearProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gear products" });
    }
  });

  // Twitter feed endpoints
  app.get("/api/twitter/posts", async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const posts = await storage.getLatestTwitterPosts(parseInt(limit as string));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Twitter posts" });
    }
  });

  // Twitter API integration endpoint (for fetching live tweets)
  app.post("/api/twitter/refresh", async (req, res) => {
    try {
      // This would integrate with Twitter API v2
      const twitterApiKey = process.env.TWITTER_API_KEY || process.env.TWITTER_BEARER_TOKEN;
      
      if (!twitterApiKey) {
        res.status(500).json({ message: "Twitter API key not configured" });
        return;
      }

      // In a real implementation, this would fetch from Twitter API
      // For now, return the stored posts
      const posts = await storage.getLatestTwitterPosts(10);
      res.json({ posts, lastUpdated: new Date().toISOString() });
      
    } catch (error) {
      res.status(500).json({ message: "Failed to refresh Twitter feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
