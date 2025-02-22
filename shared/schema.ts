import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  examinationType: json("examination_type").notNull(),
  generalExperience: text("general_experience").notNull(),
  bookingRating: text("booking_rating").notNull(),
  careQuality: text("care_quality").notNull(),
  adequateExplanation: text("adequate_explanation").notNull(),
  comfortableTreatment: text("comfortable_treatment").notNull(),
  costInformed: text("cost_informed").notNull(),
  aftercareInstructions: text("aftercare_instructions").notNull(),
  comments: text("comments"),
  language: text("language").notNull(),
  createdAt: text("created_at").notNull(),
});

const ratingEnum = z.enum(['excellent', 'good', 'medium', 'weak']);
const satisfactionEnum = z.enum(['very_satisfied', 'satisfied', 'neutral', 'dissatisfied']);

export const insertFeedbackSchema = createInsertSchema(feedback)
  .extend({
    examinationType: z.array(z.string()),
    generalExperience: ratingEnum,
    bookingRating: ratingEnum,
    careQuality: ratingEnum,
    adequateExplanation: satisfactionEnum,
    comfortableTreatment: satisfactionEnum,
    costInformed: satisfactionEnum,
    aftercareInstructions: satisfactionEnum,
    comments: z.string().optional(),
    language: z.enum(['en', 'ar']),
    createdAt: z.string().default(() => new Date().toISOString()),
  });

export type Doctor = typeof doctors.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;