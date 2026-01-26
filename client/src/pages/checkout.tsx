import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone must be at least 10 characters"),
  shippingAddress: z.string().min(10, "Address must be at least 10 characters"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const createOrder = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const orderData = {
        ...data,
        totalAmount: totalPrice.toFixed(2),
        status: "pending",
        paymentStatus: "pending",
      };

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        subtotal: (parseFloat(item.product.price) * item.quantity).toFixed(2),
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderData, items: orderItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setOrderId(data.order.id);
      setOrderSuccess(true);
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Order #${data.order.id} has been created.`,
      });
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (items.length === 0 && !orderSuccess) {
    setLocation("/cart");
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-dark-primary text-white">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-dark-secondary border-chrome-dark p-12 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-400 mb-6">
                Thank you for your order. Order #{orderId} has been placed successfully.
              </p>
              <p className="text-gray-400 mb-8">
                You will receive a confirmation email shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="border-chrome-dark"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => setLocation("/store")}
                  className="bg-orange-accent hover:bg-orange-600"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-dark-secondary border-chrome-dark">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                  
                  <form onSubmit={handleSubmit((data) => createOrder.mutate(data))} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input
                        {...register("customerName")}
                        className="bg-dark-primary border-chrome-dark text-white"
                        placeholder="John Doe"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        {...register("customerEmail")}
                        type="email"
                        className="bg-dark-primary border-chrome-dark text-white"
                        placeholder="john@example.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        {...register("customerPhone")}
                        type="tel"
                        className="bg-dark-primary border-chrome-dark text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Shipping Address</label>
                      <Textarea
                        {...register("shippingAddress")}
                        className="bg-dark-primary border-chrome-dark text-white"
                        placeholder="123 Main St, City, State, ZIP"
                        rows={4}
                      />
                      {errors.shippingAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={createOrder.isPending}
                      className="w-full bg-orange-accent hover:bg-orange-600 text-white"
                      size="lg"
                    >
                      {createOrder.isPending ? "Processing..." : "Place Order"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-dark-secondary border-chrome-dark sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item, index) => (
                      <div key={`${item.product.id}-${index}`} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-400">
                            {item.size && `${item.size}`}
                            {item.size && item.color && " • "}
                            {item.color && `${item.color}`}
                            {" × " + item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold">
                          KSh {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-chrome-dark pt-4 space-y-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-orange-accent">KSh {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
