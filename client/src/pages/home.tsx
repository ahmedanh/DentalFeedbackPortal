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

const EXAMINATION_TYPES = {
  en: [
    "X-ray image",
    "Charge (Photoprotective/temporary)",
    "Dislocation (normal/surgical)",
    "Treatment of carrots",
    "Pediatric treatment",
    "Fixed installation",
    "Mobile Installation"
  ],
  ar: [
    "صورة أشعة سينية",
    "حشوة (وقائية/مؤقتة)",
    "خلع (عادي/جراحي)",
    "علاج عصب",
    "علاج أطفال",
    "تركيبات ثابتة",
    "تركيبات متحركة"
  ]
};

const RATING_OPTIONS = {
  en: [
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "medium", label: "Medium" },
    { value: "weak", label: "Weak" }
  ],
  ar: [
    { value: "excellent", label: "ممتاز" },
    { value: "good", label: "جيد" },
    { value: "medium", label: "متوسط" },
    { value: "weak", label: "ضعيف" }
  ]
};

const SATISFACTION_OPTIONS = {
  en: [
    { value: "very_satisfied", label: "Very Satisfied" },
    { value: "satisfied", label: "Satisfied" },
    { value: "neutral", label: "Neutral" },
    { value: "dissatisfied", label: "Dissatisfied" }
  ],
  ar: [
    { value: "very_satisfied", label: "راضٍ جداً" },
    { value: "satisfied", label: "راضٍ" },
    { value: "neutral", label: "محايد" },
    { value: "dissatisfied", label: "غير راضٍ" }
  ]
};

const TRANSLATIONS = {
  en: {
    title: "NUSU Dental Clinic Feedback",
    description: "Thank you for choosing our clinic for treatment. We appreciate your feedback as it helps us improve the quality of care we provide. Please take a few minutes to answer the following questions. Your remarks are confidential.",
    examinationType: "Type of Examination (Select all that apply)",
    generalExperience: "How would you rate your general experience in our clinic?",
    bookingRating: "How do you rate the ease of booking and the waiting time before your appointment?",
    careQuality: "How would you assess the quality of care you received during your treatment?",
    adequateExplanation: "How satisfied are you with the doctor's explanation of the treatment procedures?",
    comfortableTreatment: "How comfortable were you during the treatment?",
    costInformed: "How satisfied are you with the cost information provided before the procedure?",
    aftercareInstructions: "How clear were the aftercare instructions provided?",
    comments: "Comments/suggestions/complaints",
    commentsPlaceholder: "Please share your thoughts...",
    submit: "Submit Feedback",
    submitting: "Submitting..."
  },
  ar: {
    title: "استبيان عيادة طب الأسنان - جامعة الوطنية",
    description: "شكراً لاختيارك عيادتنا للعلاج. نقدر ملاحظاتك لأنها تساعدنا في تحسين جودة الرعاية التي نقدمها. يرجى أخذ بضع دقائق للإجابة على الأسئلة التالية. ملاحظاتك سرية.",
    examinationType: "نوع الفحص (يمكن اختيار أكثر من خيار)",
    generalExperience: "كيف تقيم تجربتك العامة في عيادتنا؟",
    bookingRating: "كيف تقيم سهولة الحجز ووقت الانتظار قبل موعدك؟",
    careQuality: "كيف تقيم جودة الرعاية التي تلقيتها أثناء العلاج؟",
    adequateExplanation: "ما مدى رضاك عن شرح الطبيب لإجراءات العلاج؟",
    comfortableTreatment: "ما مدى راحتك أثناء العلاج؟",
    costInformed: "ما مدى رضاك عن المعلومات المقدمة حول التكلفة قبل الإجراء؟",
    aftercareInstructions: "ما مدى وضوح تعليمات الرعاية بعد العلاج؟",
    comments: "التعليقات/الاقتراحات/الشكاوى",
    commentsPlaceholder: "يرجى مشاركة أفكارك...",
    submit: "إرسال التقييم",
    submitting: "جاري الإرسال..."
  }
};

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
      adequateExplanation: undefined,
      comfortableTreatment: undefined,
      costInformed: undefined,
      aftercareInstructions: undefined,
      comments: "",
      language: "en"
    },
  });

  const currentLanguage = form.watch("language") as "en" | "ar";
  const t = TRANSLATIONS[currentLanguage];

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
    <div className={`min-h-screen bg-background p-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
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
              {t.title}
            </CardTitle>
            <CardDescription className="text-center mt-4">
              {t.description}
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
                      <FormLabel>{t.examinationType}</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EXAMINATION_TYPES[currentLanguage].map((type, index) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value.includes(EXAMINATION_TYPES.en[index])}
                              onCheckedChange={(checked) => {
                                const engType = EXAMINATION_TYPES.en[index];
                                const updatedTypes = checked
                                  ? [...field.value, engType]
                                  : field.value.filter((t) => t !== engType);
                                field.onChange(updatedTypes);
                              }}
                            />
                            <label className="text-sm ms-2">{type}</label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {['generalExperience', 'bookingRating', 'careQuality'].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t[fieldName as keyof typeof t]}
                        </FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                          {RATING_OPTIONS[currentLanguage].map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal ms-2">{option.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {['adequateExplanation', 'comfortableTreatment', 'costInformed', 'aftercareInstructions'].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t[fieldName as keyof typeof t]}</FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                          {SATISFACTION_OPTIONS[currentLanguage].map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal ms-2">{option.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
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
                      <FormLabel>{t.comments}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.commentsPlaceholder}
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
                  {mutation.isPending ? t.submitting : t.submit}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}