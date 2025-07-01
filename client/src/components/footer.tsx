export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-dark-primary border-t border-chrome-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-orange-accent text-2xl">🏍️</div>
              <span className="font-bold text-xl text-white">NduthiGear</span>
            </div>
            <p className="text-gray-400">
              Expert motorcycle consultation and premium gear for confident riders.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-chrome hover:text-orange-accent transition-colors">
                🐦
              </a>
              <a href="#" className="text-chrome hover:text-orange-accent transition-colors">
                📷
              </a>
              <a href="#" className="text-chrome hover:text-orange-accent transition-colors">
                📺
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Motorcycle Consultation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Budget Guidance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Confidence Riding
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Equipment Recommendations
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("gear")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Helmets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("gear")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Protective Gear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("gear")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Accessories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("gear")}
                  className="hover:text-orange-accent transition-colors"
                >
                  Maintenance Tools
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>+1 (555) 123-BIKE</li>
              <li>hello@nduthigear.com</li>
              <li>Mon-Fri 9AM-6PM PST</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-chrome-dark mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 NduthiGear. All rights reserved. | Ride Safe, Ride Confident</p>
        </div>
      </div>
    </footer>
  );
}
