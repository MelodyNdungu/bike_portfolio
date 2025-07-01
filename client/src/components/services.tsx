import { Card, CardContent } from "@/components/ui/card";
import { Bike, DollarSign, Shield, HardHat } from "lucide-react";

const services = [
  {
    icon: Bike,
    title: "Motorcycle Type Consultation",
    description: "Find the perfect bike that matches your riding style, experience level, and intended use.",
    price: "Starting at $75",
  },
  {
    icon: DollarSign,
    title: "Budget Guidance",
    description: "Smart financial planning for your motorcycle purchase, insurance, and ongoing maintenance costs.",
    price: "Starting at $50",
  },
  {
    icon: Shield,
    title: "Confidence Riding",
    description: "Build confidence and skills with personalized riding techniques and safety protocols for beginners.",
    price: "Starting at $100",
  },
  {
    icon: HardHat,
    title: "Equipment Recommendations",
    description: "Expert advice on helmets, protective gear, and accessories that match your needs and budget.",
    price: "Starting at $60",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl md:text-5xl mb-4">Expert Consultation Services</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From first-time riders to experienced bikers, I provide personalized guidance to enhance your motorcycle experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="bg-dark-primary border-chrome-dark hover:border-orange-accent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group"
            >
              <CardContent className="p-6">
                <div className="text-orange-accent text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  <service.icon className="h-10 w-10" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="text-orange-accent font-medium">{service.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
