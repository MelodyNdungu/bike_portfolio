import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, MotorcycleCategory, Order } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const { data: categories } = useQuery<MotorcycleCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    productType: "helmet",
    price: "",
    motorcycleCategoryId: "",
    brand: "",
    sizes: "",
    colors: "",
    imageUrl: "",
    stockQuantity: "0",
    featured: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewProduct({ ...newProduct, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProductForm = () => {
    const errors: Record<string, string> = {};

    if (!newProduct.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      errors.price = "Valid price is required";
    }

    if (!newProduct.motorcycleCategoryId) {
      errors.motorcycleCategoryId = "Category is required";
    }

    if (!newProduct.brand.trim()) {
      errors.brand = "Brand is required";
    }

    if (!newProduct.imageUrl) {
      errors.imageUrl = "Product image is required";
    }

    if (!newProduct.stockQuantity || parseInt(newProduct.stockQuantity) < 0) {
      errors.stockQuantity = "Valid stock quantity is required";
    }

    if (!newProduct.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProduct = () => {
    if (validateProductForm()) {
      createProduct.mutate(newProduct);
    } else {
      toast({ 
        title: "Validation Error", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
    }
  };

  const createProduct = useMutation({
    mutationFn: async (data: typeof newProduct) => {
      const productData = {
        ...data,
        motorcycleCategoryId: parseInt(data.motorcycleCategoryId),
        stockQuantity: parseInt(data.stockQuantity),
        sizes: JSON.stringify(data.sizes.split(",").map((s) => s.trim())),
        colors: JSON.stringify(data.colors.split(",").map((c) => c.trim())),
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductForm(false);
      setNewProduct({
        name: "",
        description: "",
        productType: "helmet",
        price: "",
        motorcycleCategoryId: "",
        brand: "",
        sizes: "",
        colors: "",
        imageUrl: "",
        stockQuantity: "0",
        featured: false,
      });
      setImageFile(null);
      setImagePreview("");
      setFormErrors({});
      toast({ title: "Product created successfully!" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully!" });
    },
  });

  const createCategory = useMutation({
    mutationFn: async (data: typeof newCategory) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setShowCategoryForm(false);
      setNewCategory({
        name: "",
        description: "",
      });
      toast({ title: "Category created successfully!" });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete category");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category deleted successfully!" });
    },
  });

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-dark-secondary border-chrome-dark mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="mb-6">
                <Button
                  onClick={() => setShowProductForm(!showProductForm)}
                  className="bg-orange-accent hover:bg-orange-600"
                >
                  {showProductForm ? "Cancel" : "Add New Product"}
                </Button>
              </div>

              {showProductForm && (
                <Card className="bg-dark-secondary border-chrome-dark mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                      />
                      <Input
                        placeholder="Brand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                      />
                      <Input
                        placeholder="Stock Quantity"
                        type="number"
                        value={newProduct.stockQuantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                      />
                      <Select
                        value={newProduct.productType}
                        onValueChange={(value) => setNewProduct({ ...newProduct, productType: value })}
                      >
                        <SelectTrigger className="bg-dark-primary border-chrome-dark text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-secondary border-chrome-dark">
                          <SelectItem value="helmet">Helmet</SelectItem>
                          <SelectItem value="jacket">Jacket</SelectItem>
                          <SelectItem value="gloves">Gloves</SelectItem>
                          <SelectItem value="boots">Boots</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={newProduct.motorcycleCategoryId}
                        onValueChange={(value) => setNewProduct({ ...newProduct, motorcycleCategoryId: value })}
                      >
                        <SelectTrigger className="bg-dark-primary border-chrome-dark text-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-secondary border-chrome-dark">
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Sizes (comma-separated)"
                        value={newProduct.sizes}
                        onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                      />
                      <Input
                        placeholder="Colors (comma-separated)"
                        value={newProduct.colors}
                        onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                      />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Product Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0
                            file:text-sm file:font-semibold
                            file:bg-orange-accent file:text-white
                            hover:file:bg-orange-600
                            cursor-pointer"
                        />
                        {imagePreview && (
                          <div className="mt-4">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-48 object-cover rounded border border-chrome-dark"
                            />
                          </div>
                        )}
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white md:col-span-2"
                        rows={3}
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newProduct.featured}
                          onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                          className="rounded"
                        />
                        <span>Featured Product</span>
                      </label>
                    </div>
                    <Button
                      onClick={handleCreateProduct}
                      disabled={createProduct.isPending}
                      className="mt-4 bg-orange-accent hover:bg-orange-600"
                    >
                      {createProduct.isPending ? "Creating..." : "Create Product"}
                    </Button>
                    {Object.keys(formErrors).length > 0 && (
                      <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded">
                        <p className="text-red-400 font-semibold mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside text-sm text-red-300">
                          {Object.entries(formErrors).map(([field, error]) => (
                            <li key={field}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map((product) => (
                  <Card key={product.id} className="bg-dark-secondary border-chrome-dark">
                    <CardContent className="p-4">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">KSh {parseFloat(product.price).toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mb-3">Stock: {product.stockQuantity}</p>
                      <Button
                        onClick={() => deleteProduct.mutate(product.id)}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="mb-6">
                <Button
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="bg-orange-accent hover:bg-orange-600"
                >
                  {showCategoryForm ? "Cancel" : "Add New Category"}
                </Button>
              </div>

              {showCategoryForm && (
                <Card className="bg-dark-secondary border-chrome-dark mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Create New Category</h2>
                    <div className="space-y-4">
                      <Input
                        placeholder="Category Name (e.g., Sport, Cruiser)"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                      />
                      <Textarea
                        placeholder="Category Description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="bg-dark-primary border-chrome-dark text-white"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={() => createCategory.mutate(newCategory)}
                      disabled={createCategory.isPending}
                      className="mt-4 bg-orange-accent hover:bg-orange-600"
                    >
                      {createCategory.isPending ? "Creating..." : "Create Category"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {categories?.map((category) => (
                  <Card key={category.id} className="bg-dark-secondary border-chrome-dark">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-gray-400 mb-4">{category.description}</p>
                      <Button
                        onClick={() => deleteCategory.mutate(category.id)}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="space-y-4">
                {orders?.map((order) => (
                  <Card key={order.id} className="bg-dark-secondary border-chrome-dark">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">Order #{order.id}</h3>
                          <p className="text-gray-400">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-accent">
                            KSh {parseFloat(order.totalAmount).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400">{order.status}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
