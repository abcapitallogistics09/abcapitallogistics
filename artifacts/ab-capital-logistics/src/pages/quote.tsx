import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useSubmitQuote } from "@workspace/api-client-react";
import heroQuote from "@/assets/hero-quote.png";

const quoteSchema = z.object({
  freightType: z.string().min(1, "Please select a freight type"),
  cargoType: z.string().min(2, "Please describe your cargo"),
  weight: z.string().min(1, "Please enter weight"),
  volume: z.string().optional(),
  origin: z.string().min(2, "Please enter origin"),
  destination: z.string().min(2, "Please enter destination"),
  incoterms: z.string().optional(),
  hazardous: z.boolean().default(false),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  company: z.string().optional(),
  message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const STEPS = ["Cargo Details", "Contact Info", "Review & Submit"];

const freightOptions = [
  { value: "air", label: "Air Freight" },
  { value: "ocean", label: "Ocean Freight" },
  { value: "road", label: "Road Freight" },
  { value: "customs", label: "Customs Clearance" },
  { value: "warehousing", label: "Warehousing" },
  { value: "threepl", label: "3PL Solutions" },
];

const incotermsOptions = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"];

export default function Quote() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const submitQuote = useSubmitQuote();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      freightType: "",
      cargoType: "",
      weight: "",
      volume: "",
      origin: "",
      destination: "",
      incoterms: "",
      hazardous: false,
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const step1Fields: (keyof QuoteFormValues)[] = ["freightType", "cargoType", "weight", "origin", "destination"];

  async function handleNext() {
    let valid = false;
    if (step === 0) {
      valid = await form.trigger(step1Fields);
    } else if (step === 1) {
      valid = await form.trigger(["name", "email", "phone"]);
    }
    if (valid) setStep(step + 1);
  }

  function onSubmit(data: QuoteFormValues) {
    submitQuote.mutate(
      {
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          origin: data.origin,
          destination: data.destination,
          freightType: data.freightType as "air" | "ocean" | "road" | "warehousing" | "customs" | "threepl",
          cargoType: data.cargoType,
          weight: data.weight,
          volume: data.volume || null,
          incoterms: data.incoterms || null,
          hazardous: data.hazardous,
          message: data.message || null,
        },
      },
      {
        onSuccess: (res) => {
          setReferenceNumber(res.referenceNumber);
          setSubmitted(true);
        },
      }
    );
  }

  const values = form.getValues();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('${heroQuote}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Get a Quote</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Request a Freight Quote</h1>
            <p className="text-gray-300 text-lg">Tell us about your shipment and we'll respond within 24 hours.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-10"
              data-testid="quote-success"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-3">Quote Request Received!</h2>
              <p className="text-gray-600 mb-4">
                Our logistics team will review your requirements and contact you within 24 hours.
              </p>
              <div className="inline-block bg-blue-50 border border-blue-100 rounded-lg px-6 py-3 mb-6">
                <p className="text-xs text-gray-500 mb-1">Your Reference Number</p>
                <p className="font-bold text-primary text-xl" data-testid="text-reference-number">{referenceNumber}</p>
              </div>
              <p className="text-sm text-gray-500">
                Questions? Call us at{" "}
                <a href="tel:+237677238818" className="text-accent font-medium">+237 677-238-818</a>
              </p>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Progress */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i < step ? 'bg-green-500 border-green-500 text-white' : i === step ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-400'}`}>
                          {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className="hidden md:block text-sm font-medium">{s}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
                  <AnimatePresence mode="wait">
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <h2 className="text-xl font-bold text-primary mb-4">Cargo Details</h2>
                        <FormField
                          control={form.control}
                          name="freightType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Freight Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-freight-type">
                                    <SelectValue placeholder="Select freight type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {freightOptions.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cargoType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo Description *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Electronics, FMCG goods, machinery" data-testid="input-cargo-type" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight (kg) *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 500 kg" data-testid="input-weight" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="volume"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Volume (CBM)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 2.5 CBM" data-testid="input-volume" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="origin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Origin *</FormLabel>
                                <FormControl>
                                  <Input placeholder="City, Country" data-testid="input-origin" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Destination *</FormLabel>
                                <FormControl>
                                  <Input placeholder="City, Country" data-testid="input-destination" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="incoterms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Incoterms</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-incoterms">
                                    <SelectValue placeholder="Select incoterms (optional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {incotermsOptions.map((i) => (
                                    <SelectItem key={i} value={i}>{i}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hazardous"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-hazardous"
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                This shipment contains hazardous materials (DG Cargo)
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <h2 className="text-xl font-bold text-primary mb-4">Contact Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" data-testid="input-name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Company name" data-testid="input-company" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" data-testid="input-email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+237 6XX XXX XXX" data-testid="input-phone" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any special requirements, delivery instructions, or questions..." rows={4} data-testid="textarea-message" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-xl font-bold text-primary mb-6">Review Your Quote Request</h2>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Cargo Details</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div><span className="text-gray-500">Freight Type:</span> <span className="font-medium">{freightOptions.find(f => f.value === values.freightType)?.label}</span></div>
                              <div><span className="text-gray-500">Cargo:</span> <span className="font-medium">{values.cargoType}</span></div>
                              <div><span className="text-gray-500">Weight:</span> <span className="font-medium">{values.weight}</span></div>
                              {values.volume && <div><span className="text-gray-500">Volume:</span> <span className="font-medium">{values.volume}</span></div>}
                              <div><span className="text-gray-500">Origin:</span> <span className="font-medium">{values.origin}</span></div>
                              <div><span className="text-gray-500">Destination:</span> <span className="font-medium">{values.destination}</span></div>
                              {values.incoterms && <div><span className="text-gray-500">Incoterms:</span> <span className="font-medium">{values.incoterms}</span></div>}
                              <div><span className="text-gray-500">Hazardous:</span> <span className="font-medium">{values.hazardous ? "Yes" : "No"}</span></div>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{values.name}</span></div>
                              {values.company && <div><span className="text-gray-500">Company:</span> <span className="font-medium">{values.company}</span></div>}
                              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{values.email}</span></div>
                              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{values.phone}</span></div>
                            </div>
                          </div>
                          {values.message && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Additional Notes</h3>
                              <p className="text-sm text-gray-600">{values.message}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    {step > 0 ? (
                      <Button type="button" variant="outline" onClick={() => setStep(step - 1)} data-testid="button-back">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                      </Button>
                    ) : (
                      <div />
                    )}
                    {step < 2 ? (
                      <Button type="button" onClick={handleNext} className="bg-accent hover:bg-accent/90 text-white" data-testid="button-next">
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-accent hover:bg-accent/90 text-white px-8" disabled={submitQuote.isPending} data-testid="button-submit-quote">
                        {submitQuote.isPending ? "Submitting..." : "Submit Quote Request"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
