import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/analytics", async (_req, res) => {
    const feedbacks = await storage.getAllFeedback();

    // Calculate analytics
    const analytics = {
      totalFeedback: feedbacks.length,
      arabicCount: feedbacks.filter(f => f.language === 'ar').length,
      englishCount: feedbacks.filter(f => f.language === 'en').length,

      // Calculate experience ratings distribution
      experienceRatings: feedbacks.reduce((acc, curr) => {
        acc[curr.generalExperience] = (acc[curr.generalExperience] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),

      // Calculate examination types distribution
      examinationTypes: feedbacks.reduce((acc, curr) => {
        (curr.examinationType as string[]).forEach(type => {
          acc[type] = (acc[type] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),

      // Calculate average rating (assuming excellent=100, good=75, medium=50, weak=25)
      averageRating: Math.round(
        feedbacks.reduce((sum, curr) => {
          const ratings = { excellent: 100, good: 75, medium: 50, weak: 25 };
          return sum + ratings[curr.generalExperience as keyof typeof ratings];
        }, 0) / (feedbacks.length || 1)
      )
    };

    res.json(analytics);
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const feedback = insertFeedbackSchema.parse(req.body);
      const result = await storage.createFeedback(feedback);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  return createServer(app);
}