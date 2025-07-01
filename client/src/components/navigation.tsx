import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-dark-secondary/95 backdrop-blur-sm border-b border-chrome-dark z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="text-orange-accent text-2xl">🏍️</div>
            <span className="font-bold text-xl text-white">NduthiGear</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="hover:text-orange-accent transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("services")}
              className="hover:text-orange-accent transition-colors duration-200"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection("gear")}
              className="hover:text-orange-accent transition-colors duration-200"
            >
              Gear HQ
            </button>
            <button 
              onClick={() => scrollToSection("twitter")}
              className="hover:text-orange-accent transition-colors duration-200"
            >
              Tips
            </button>
            <Button 
              onClick={() => scrollToSection("contact")}
              className="bg-orange-accent hover:bg-orange-600 text-white"
            >
              Book Consultation
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-orange-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-secondary border-t border-chrome-dark">
          <div className="px-4 py-3 space-y-3">
            <button 
              onClick={() => scrollToSection("home")}
              className="block w-full text-left hover:text-orange-accent transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("services")}
              className="block w-full text-left hover:text-orange-accent transition-colors duration-200"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection("gear")}
              className="block w-full text-left hover:text-orange-accent transition-colors duration-200"
            >
              Gear HQ
            </button>
            <button 
              onClick={() => scrollToSection("twitter")}
              className="block w-full text-left hover:text-orange-accent transition-colors duration-200"
            >
              Tips
            </button>
            <Button 
              onClick={() => scrollToSection("contact")}
              className="w-full bg-orange-accent hover:bg-orange-600 text-white"
            >
              Book Consultation
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
