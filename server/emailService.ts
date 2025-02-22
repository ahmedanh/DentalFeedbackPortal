import sgMail from '@sendgrid/mail';
import { type Feedback } from '@shared/schema';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateCharts = async (feedbacks: Feedback[]) => {
  const width = 600;
  const height = 400;
  const chartCallback = (ChartJS: any) => {
    ChartJS.defaults.responsive = true;
    ChartJS.defaults.maintainAspectRatio = false;
  };
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

  // Generate pie chart for general experience
  const experienceData = feedbacks.reduce((acc: Record<string, number>, curr) => {
    acc[curr.generalExperience] = (acc[curr.generalExperience] || 0) + 1;
    return acc;
  }, {});

  const pieChartConfig = {
    type: 'pie',
    data: {
      labels: Object.keys(experienceData),
      datasets: [{
        data: Object.values(experienceData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  };

  // Generate bar chart for examination types
  const examinationData = feedbacks.reduce((acc: Record<string, number>, curr) => {
    curr.examinationType.forEach((type: string) => {
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {});

  const barChartConfig = {
    type: 'bar',
    data: {
      labels: Object.keys(examinationData),
      datasets: [{
        label: 'Examination Types',
        data: Object.values(examinationData),
        backgroundColor: '#36A2EB'
      }]
    }
  };

  const pieChartImage = await chartJSNodeCanvas.renderToDataURL(pieChartConfig);
  const barChartImage = await chartJSNodeCanvas.renderToDataURL(barChartConfig);

  return { pieChartImage, barChartImage };
};

export const sendFeedbackEmail = async (feedback: Feedback) => {
  const msg = {
    to: 'nusu.dental.feedback@gmail.com',
    from: 'noreply@nusudental.com', // Replace with your verified sender
    subject: 'New Feedback Submission',
    html: `
      <h2>New Feedback Received</h2>
      <p><strong>Date:</strong> ${new Date(feedback.createdAt).toLocaleString()}</p>
      <p><strong>Language:</strong> ${feedback.language === 'en' ? 'English' : 'Arabic'}</p>
      <p><strong>Examination Types:</strong> ${feedback.examinationType.join(', ')}</p>
      <p><strong>General Experience:</strong> ${feedback.generalExperience}</p>
      <p><strong>Booking Rating:</strong> ${feedback.bookingRating}</p>
      <p><strong>Care Quality:</strong> ${feedback.careQuality}</p>
      <p><strong>Additional Information:</strong></p>
      <ul>
        <li>Doctor explained procedures: ${feedback.adequateExplanation ? 'Yes' : 'No'}</li>
        <li>Treatment was comfortable: ${feedback.comfortableTreatment ? 'Yes' : 'No'}</li>
        <li>Cost information provided: ${feedback.costInformed ? 'Yes' : 'No'}</li>
        <li>Aftercare instructions given: ${feedback.aftercareInstructions ? 'Yes' : 'No'}</li>
      </ul>
      ${feedback.comments ? `<p><strong>Comments:</strong> ${feedback.comments}</p>` : ''}
    `,
  };

  await sgMail.send(msg);
};
