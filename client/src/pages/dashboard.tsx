import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  const pieChartData = {
    labels: ['Excellent', 'Good', 'Medium', 'Weak'],
    datasets: [
      {
        data: [
          analytics?.experienceRatings?.excellent || 0,
          analytics?.experienceRatings?.good || 0,
          analytics?.experienceRatings?.medium || 0,
          analytics?.experienceRatings?.weak || 0,
        ],
        backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF5722'],
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(analytics?.examinationTypes || {}),
    datasets: [
      {
        label: 'Number of Examinations',
        data: Object.values(analytics?.examinationTypes || {}),
        backgroundColor: '#2196F3',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Feedback Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Feedback</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{analytics?.totalFeedback || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Rating</CardTitle>
              <CardDescription>General experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{analytics?.averageRating || 0}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Arabic</CardTitle>
              <CardDescription>Feedback in Arabic</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{analytics?.arabicCount || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>English</CardTitle>
              <CardDescription>Feedback in English</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{analytics?.englishCount || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Experience Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Examination Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <Bar 
                  data={barChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
