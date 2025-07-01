import { CheckCircle } from "lucide-react";

export default function About() {
  const achievements = [
    "Certified Motorcycle Safety Foundation Instructor",
    "500+ Successful Consultations",
    "Specialized in Beginner to Intermediate Riders",
  ];

  return (
    <section className="py-20 bg-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-bold text-4xl md:text-5xl">Meet Your Motorcycle Expert</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              With over 15 years of riding experience and a passion for helping others discover the joy of motorcycling, 
              I've guided hundreds of riders from their first bike purchase to advanced riding techniques.
            </p>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-orange-accent h-5 w-5" />
                  <span className="text-gray-200">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional motorcycle gear and equipment consultation" 
              className="rounded-xl shadow-2xl w-full h-auto border-2 border-chrome-dark"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-accent text-dark-primary p-4 rounded-xl font-bold text-lg">
              15+ Years Experience
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
