import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull(),
  rating: integer("rating").notNull(),
  comments: text("comments").notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedback)
  .extend({
    rating: z.number().min(1).max(5),
    comments: z.string().min(10),
  });

export type Doctor = typeof doctors.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;