import { doctors, feedback, type Doctor, type Feedback, type InsertFeedback } from "@shared/schema";

export interface IStorage {
  getDoctors(): Promise<Doctor[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class MemStorage implements IStorage {
  private doctors: Map<number, Doctor>;
  private feedback: Map<number, Feedback>;
  private currentFeedbackId: number;

  constructor() {
    this.doctors = new Map();
    this.feedback = new Map();
    this.currentFeedbackId = 1;
    
    // Seed some doctors
    const initialDoctors: Doctor[] = [
      { id: 1, name: "Dr. Sarah Smith", specialty: "Orthodontics" },
      { id: 2, name: "Dr. John Wilson", specialty: "General Dentistry" },
      { id: 3, name: "Dr. Maria Garcia", specialty: "Periodontics" },
      { id: 4, name: "Dr. James Chen", specialty: "Endodontics" },
    ];

    initialDoctors.forEach(doctor => {
      this.doctors.set(doctor.id, doctor);
    });
  }

  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const feedback: Feedback = { ...insertFeedback, id };
    this.feedback.set(id, feedback);
    return feedback;
  }
}

export const storage = new MemStorage();
