import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bike, ShoppingCart } from "lucide-react";
import type { Product, MotorcycleCategory } from "@shared/schema";

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: categories } = useQuery<MotorcycleCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory, selectedType],
    queryFn: async () => {
      let url = "/api/products";
      const params = new URLSearchParams();
      
      if (selectedCategory !== "all") {
        params.append("categoryId", selectedCategory);
      }
      if (selectedType !== "all") {
        params.append("type", selectedType);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-bold text-4xl md:text-5xl mb-4">Gear Store</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Premium motorcycle gear for every riding style
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-dark-secondary border-chrome-dark text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-dark-secondary border-chrome-dark">
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-dark-secondary border-chrome-dark text-white">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent className="bg-dark-secondary border-chrome-dark">
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="helmet">Helmets</SelectItem>
                <SelectItem value="jacket">Jackets</SelectItem>
                <SelectItem value="gloves">Gloves</SelectItem>
                <SelectItem value="boots">Boots</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-dark-secondary border-chrome-dark animate-pulse">
                  <div className="h-64 bg-dark-primary" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-dark-primary rounded mb-2" />
                    <div className="h-4 bg-dark-primary rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="bg-dark-secondary border-chrome-dark hover:border-orange-accent transition-all duration-200 cursor-pointer group">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2 text-white group-hover:text-orange-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-accent font-bold text-xl">
                          KSh {parseFloat(product.price).toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          className="bg-orange-accent hover:bg-orange-600"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-dark-secondary border-chrome-dark p-12 text-center">
              <Bike className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
