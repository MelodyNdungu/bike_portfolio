import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Phone, Mail, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertConsultationSchema, type InsertConsultation } from "@shared/schema";

const serviceTypes = [
  { value: "motorcycle-consultation", label: "Motorcycle Type Consultation" },
  { value: "budget-guidance", label: "Budget Guidance" },
  { value: "confidence-riding", label: "Confidence Riding" },
  { value: "equipment-recommendations", label: "Equipment Recommendations" },
];

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertConsultation>({
    resolver: zodResolver(insertConsultationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceType: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertConsultation) => {
      const response = await apiRequest("POST", "/api/consultations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Consultation Booked!",
        description: "Thank you for your request. I'll get back to you within 2-4 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book consultation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertConsultation) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl md:text-5xl mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Book your consultation today and take the first step toward confident, safe motorcycling.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <Card className="bg-dark-primary border-chrome-dark">
              <CardContent className="p-6">
                <h3 className="font-semibold text-2xl mb-4 text-white">Consultation Booking</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="First Name" 
                                className="bg-dark-secondary border-chrome-dark text-white placeholder:text-gray-400 focus:border-orange-accent"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Last Name" 
                                className="bg-dark-secondary border-chrome-dark text-white placeholder:text-gray-400 focus:border-orange-accent"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="Email Address" 
                              className="bg-dark-secondary border-chrome-dark text-white placeholder:text-gray-400 focus:border-orange-accent"
                              {...field} 
                            />
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
                          <FormControl>
                            <Input 
                              type="tel"
                              placeholder="Phone Number" 
                              className="bg-dark-secondary border-chrome-dark text-white placeholder:text-gray-400 focus:border-orange-accent"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-dark-secondary border-chrome-dark text-white focus:border-orange-accent">
                                <SelectValue placeholder="Select Service Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-dark-secondary border-chrome-dark">
                              {serviceTypes.map((service) => (
                                <SelectItem key={service.value} value={service.value}>
                                  {service.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell me about your riding experience and goals..." 
                              rows={4}
                              className="bg-dark-secondary border-chrome-dark text-white placeholder:text-gray-400 focus:border-orange-accent resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={mutation.isPending}
                      className="w-full bg-orange-accent hover:bg-orange-600 text-white px-6 py-4 text-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      {mutation.isPending ? "Booking..." : "Book Free Consultation"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-primary border-chrome-dark">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-4 text-white">Quick Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="text-orange-accent h-5 w-5" />
                    <span className="text-gray-300">+1 (555) 123-BIKE</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-orange-accent h-5 w-5" />
                    <span className="text-gray-300">hello@nduthigear.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-orange-accent">🐦</div>
                    <span className="text-gray-300">@nduthigear</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Adventure motorcycle ready for touring with luggage setup" 
              className="rounded-xl shadow-2xl w-full h-auto border-2 border-chrome-dark"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/80 via-transparent to-transparent rounded-xl" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <Card className="bg-dark-primary/90 backdrop-blur-sm border-chrome-dark">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="text-orange-accent h-5 w-5" />
                    <span className="font-semibold text-white">Response Time</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    I typically respond within 2-4 hours during business hours (9 AM - 6 PM PST)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
