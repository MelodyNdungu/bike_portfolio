import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Store } from "lucide-react";
import type { GearProduct } from "@shared/schema";

export default function GearHQ() {
  const { data: products, isLoading } = useQuery<GearProduct[]>({
    queryKey: ["/api/gear"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="gear" className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl md:text-5xl mb-4">
            <span className="text-orange-accent">NduthiGear</span> HQ
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Premium motorcycle gear and accessories, carefully curated for safety, style, and performance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-dark-primary border-chrome-dark">
                <Skeleton className="w-full h-48 rounded-t-xl" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : products?.length ? (
            products.map((product) => (
              <Card 
                key={product.id}
                className="bg-dark-primary border-chrome-dark hover:border-orange-accent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group overflow-hidden"
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-2 text-white">{product.name}</h3>
                  <p className="text-gray-400 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-accent font-bold text-lg">
                      KSH {product.priceMin.toLocaleString()} - {product.priceMax.toLocaleString()}
                    </span>
                    <Button 
                      size="sm"
                      className="bg-orange-accent hover:bg-orange-600 text-white"
                    >
                      Shop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No gear products available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={() => scrollToSection("contact")}
            size="lg"
            className="bg-orange-accent hover:bg-orange-600 text-white px-8 py-4 text-lg transition-all duration-200 transform hover:scale-105"
          >
            <Store className="mr-2 h-5 w-5" />
            Visit Full Store
          </Button>
        </div>
      </div>
    </section>
  );
}
