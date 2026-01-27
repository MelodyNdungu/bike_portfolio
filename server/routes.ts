import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertConsultationSchema,
  insertMotorcycleCategorySchema,
  insertProductSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== MOTORCYCLE CATEGORIES ====================
  
  // Get all motorcycle categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getMotorcycleCategories();
      res.json(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by ID
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getMotorcycleCategoryById(id);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.json(category);
    } catch (error) {
      console.error("Failed to fetch category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Create motorcycle category (admin only)
  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertMotorcycleCategorySchema.parse(req.body);
      const category = await storage.createMotorcycleCategory(validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        console.error("Failed to create category:", error);
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Update motorcycle category (admin only)
  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateMotorcycleCategory(id, req.body);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.json(category);
    } catch (error) {
      console.error("Failed to update category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete motorcycle category (admin only)
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMotorcycleCategory(id);
      if (!success) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Failed to delete category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // ==================== PRODUCTS ====================
  
  // Get all products with optional filtering
  app.get("/api/products", async (req, res) => {
    try {
      const { type, categoryId, featured } = req.query;
      let products;

      if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else if (type && typeof type === 'string') {
        products = await storage.getProductsByType(type);
      } else if (categoryId && typeof categoryId === 'string') {
        products = await storage.getProductsByCategory(parseInt(categoryId));
      } else {
        products = await storage.getProducts();
      }

      res.json(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create product (admin only)
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        console.error("Failed to create product:", error);
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  // Update product (admin only)
  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      console.error("Failed to update product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product (admin only)
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Failed to delete product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ==================== ORDERS ====================
  
  // Get all orders (admin only)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
      const items = await storage.getOrderItems(id);
      res.json({ ...order, items });
    } catch (error) {
      console.error("Failed to fetch order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Create order (checkout)
  app.post("/api/orders", async (req, res) => {
    try {
      const { order: orderData, items } = req.body;
      
      // Validate order data
      const validatedOrder = insertOrderSchema.parse(orderData);
      
      // Create order
      const order = await storage.createOrder(validatedOrder);
      
      // Create order items
      const orderItems = await Promise.all(
        items.map((item: any) => {
          const validatedItem = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          return storage.createOrderItem(validatedItem);
        })
      );
      
      res.json({ order, items: orderItems });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        console.error("Failed to create order:", error);
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      console.error("Failed to update order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // ==================== EXISTING ROUTES ====================

  // Consultation booking endpoint
  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid consultation data", errors: error.errors });
      } else {
        console.error("Consultation creation error:", error);
        res.status(500).json({ message: "Failed to create consultation" });
      }
    }
  });

  // Get all consultations
  app.get("/api/consultations", async (req, res) => {
    try {
      const consultations = await storage.getConsultations();
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Get gear products
  app.get("/api/gear", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getGearProductsByCategory(category);
      } else {
        products = await storage.getGearProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gear products" });
    }
  });

  // Twitter feed endpoints
  app.get("/api/twitter/posts", async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const posts = await storage.getLatestTwitterPosts(parseInt(limit as string));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Twitter posts" });
    }
  });

  // Twitter API integration endpoint (for fetching live tweets)
  app.post("/api/twitter/refresh", async (req, res) => {
    try {
      // This would integrate with Twitter API v2
      const twitterApiKey = process.env.TWITTER_API_KEY || process.env.TWITTER_BEARER_TOKEN;
      
      if (!twitterApiKey) {
        res.status(500).json({ message: "Twitter API key not configured" });
        return;
      }

      // In a real implementation, this would fetch from Twitter API
      // For now, return the stored posts
      const posts = await storage.getLatestTwitterPosts(10);
      res.json({ posts, lastUpdated: new Date().toISOString() });
      
    } catch (error) {
      res.status(500).json({ message: "Failed to refresh Twitter feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
