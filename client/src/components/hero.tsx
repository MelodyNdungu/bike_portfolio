import { Button } from "@/components/ui/button";
import { Calendar, ShoppingBag, ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-tight">
            Master Your <span className="text-orange-accent">Motorcycle</span> Journey
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional motorcycle consultation and premium gear for riders who demand confidence, safety, and adventure on every ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-orange-accent hover:bg-orange-600 text-white px-8 py-4 text-lg transition-all duration-200 transform hover:scale-105"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Free Consultation
            </Button>
            <Button 
              onClick={() => scrollToSection("gear")}
              variant="outline"
              size="lg"
              className="border-2 border-chrome hover:border-orange-accent hover:text-orange-accent px-8 py-4 text-lg transition-all duration-200 transform hover:scale-105"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Gear
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-chrome text-2xl h-8 w-8" />
        </div>
      </div>
    </section>
  );
}
