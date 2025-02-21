import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Success() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-2">
            Thank You for Your Feedback!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your feedback has been submitted successfully and will help us improve our services.
          </p>
          <Button asChild>
            <Link href="/">Submit Another Feedback</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
