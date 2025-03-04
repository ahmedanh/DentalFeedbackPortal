import { feedback, type Feedback, type InsertFeedback } from "@shared/schema";
import nodemailer from "nodemailer";
import { Chart, type ChartConfiguration } from "chart.js/auto";
import { createCanvas } from "canvas";

export interface IStorage {
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedback(): Promise<Feedback[]>;
}

export class MemStorage implements IStorage {
  private feedbacks: Map<number, Feedback>;
  private currentId: number;

  constructor() {
    this.feedbacks = new Map();
    this.currentId = 1;
  }

  private async generateCharts(): Promise<{ pieChartBuffer: Buffer; barChartBuffer: Buffer }> {
    const feedbacks = Array.from(this.feedbacks.values());

    // If there's no feedback yet, create empty charts
    if (feedbacks.length === 0) {
      const emptyCanvas = createCanvas(400, 400);
      const emptyBuffer = emptyCanvas.toBuffer();
      return {
        pieChartBuffer: emptyBuffer,
        barChartBuffer: emptyBuffer
      };
    }

    // Generate data for pie chart (general experience)
    const experienceData = feedbacks.reduce((acc: Record<string, number>, curr) => {
      acc[curr.generalExperience] = (acc[curr.generalExperience] || 0) + 1;
      return acc;
    }, {});

    // Generate data for bar chart (examination types)
    const examinationData = feedbacks.reduce((acc: Record<string, number>, curr) => {
      (curr.examinationType as string[]).forEach((type) => {
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    }, {});

    // Create pie chart
    const pieCanvas = createCanvas(400, 400);
    const pieCtx = pieCanvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    const pieConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: Object.keys(experienceData),
        datasets: [{
          data: Object.values(experienceData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      },
      options: {
        responsive: false,
        animation: false
      }
    };
    new Chart(pieCtx, pieConfig);

    // Create bar chart
    const barCanvas = createCanvas(600, 400);
    const barCtx = barCanvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    const barConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: Object.keys(examinationData),
        datasets: [{
          label: 'Examination Types',
          data: Object.values(examinationData),
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: false,
        animation: false
      }
    };
    new Chart(barCtx, barConfig);

    return {
      pieChartBuffer: pieCanvas.toBuffer(),
      barChartBuffer: barCanvas.toBuffer()
    };
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentId++;
    const feedback: Feedback = { 
      id, 
      ...insertFeedback,
      comments: insertFeedback.comments || null
    };
    this.feedbacks.set(id, feedback);

    // Log the feedback to console for verification
    console.log('New feedback received:', {
      id: feedback.id,
      language: feedback.language,
      examinationType: feedback.examinationType,
      generalExperience: feedback.generalExperience,
      createdAt: feedback.createdAt
    });

    return feedback;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values());
  }
}

export const storage = new MemStorage();