import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary text-white">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-96 bg-dark-secondary rounded-lg mb-8" />
              <div className="h-8 bg-dark-secondary rounded w-1/2 mb-4" />
              <div className="h-4 bg-dark-secondary rounded w-1/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-primary text-white">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <Link href="/store">
              <Button className="bg-orange-accent hover:bg-orange-600">
                Back to Store
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sizes = JSON.parse(product.sizes);
  const colors = JSON.parse(product.colors);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addItem(product, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedSize}, ${selectedColor})`,
    });
  };

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/store">
            <Button variant="ghost" className="mb-6 hover:text-orange-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400 mb-4">{product.brand}</p>
              <p className="text-3xl font-bold text-orange-accent mb-6">
                KSh {parseFloat(product.price).toLocaleString()}
              </p>

              <p className="text-gray-300 mb-6">{product.description}</p>

              <Card className="bg-dark-secondary border-chrome-dark mb-6">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="bg-dark-primary border-chrome-dark text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-secondary border-chrome-dark">
                        {sizes.map((size: string) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="bg-dark-primary border-chrome-dark text-white">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-secondary border-chrome-dark">
                        {colors.map((color: string) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="border-chrome-dark"
                      >
                        -
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        className="border-chrome-dark"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {product.inStock ? (
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-accent hover:bg-orange-600 text-white text-lg py-6"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              ) : (
                <Button disabled className="w-full" size="lg">
                  Out of Stock
                </Button>
              )}

              <div className="mt-6 text-sm text-gray-400">
                <p>Stock: {product.stockQuantity} available</p>
                <p>Category: {product.productType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
