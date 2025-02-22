import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertFeedbackSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EXAMINATION_TYPES = [
  "X-ray image",
  "Charge (Photoprotective/temporary)",
  "Dislocation (normal/surgical)",
  "Treatment of carrots",
  "Pediatric treatment",
  "Fixed installation",
  "Mobile Installation"
];

const RATING_OPTIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "medium", label: "Medium" },
  { value: "weak", label: "Weak" }
];

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      examinationType: [],
      generalExperience: undefined,
      bookingRating: undefined,
      careQuality: undefined,
      adequateExplanation: false,
      comfortableTreatment: false,
      costInformed: false,
      aftercareInstructions: false,
      comments: "",
      language: "en"
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      await apiRequest("POST", "/api/feedback", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      navigate("/success");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-end">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary text-center">
              NUSU Dental Clinic Feedback
            </CardTitle>
            <CardDescription className="text-center mt-4">
              Thank you for choosing our clinic for treatment. We appreciate your feedback as it helps us improve
              the quality of care we provide. Please take a few minutes to answer the following questions.
              Your remarks are confidential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <FormField
                  control={form.control}
                  name="examinationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Examination (Select all that apply)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EXAMINATION_TYPES.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value.includes(type)}
                              onCheckedChange={(checked) => {
                                const updatedTypes = checked
                                  ? [...field.value, type]
                                  : field.value.filter((t) => t !== type);
                                field.onChange(updatedTypes);
                              }}
                            />
                            <label className="text-sm">{type}</label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {['generalExperience', 'bookingRating', 'careQuality'].map((fieldName, index) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldName === 'generalExperience' && 'How would you rate your general experience in our clinic?'}
                          {fieldName === 'bookingRating' && 'How do you rate the ease of booking and the waiting time before your appointment?'}
                          {fieldName === 'careQuality' && 'How would you assess the quality of care you received during your treatment?'}
                        </FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                          {RATING_OPTIONS.map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {['adequateExplanation', 'comfortableTreatment', 'costInformed', 'aftercareInstructions'].map((fieldName, index) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {fieldName === 'adequateExplanation' && 'Did the doctor explain the treatment procedures adequately?'}
                          {fieldName === 'comfortableTreatment' && 'Was the treatment comfortable and satisfactory?'}
                          {fieldName === 'costInformed' && 'Have you been informed of the costs of treatment before the procedure begins?'}
                          {fieldName === 'aftercareInstructions' && 'Have you been provided with clear instructions for care after treatment?'}
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments/suggestions/complaints</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please share your thoughts..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}