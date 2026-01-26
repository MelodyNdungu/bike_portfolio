import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // customer, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Motorcycle categories for product filtering
export const motorcycleCategories = pgTable("motorcycle_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "Sport", "Cruiser", "Adventure", "Touring"
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Store products (helmets, jackets, etc.)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  productType: text("product_type").notNull(), // "helmet", "jacket", "gloves", "boots", etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  motorcycleCategoryId: integer("motorcycle_category_id").references(() => motorcycleCategories.id),
  brand: text("brand").notNull(),
  sizes: text("sizes").notNull(), // JSON array of available sizes
  colors: text("colors").notNull(), // JSON array of available colors
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images"), // JSON array of image URLs
  stockQuantity: integer("stock_quantity").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size"),
  color: text("color"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceType: text("service_type").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gearProducts = pgTable("gear_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priceMin: integer("price_min").notNull(),
  priceMax: integer("price_max").notNull(),
  imageUrl: text("image_url").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
});

export const twitterPosts = pgTable("twitter_posts", {
  id: serial("id").primaryKey(),
  tweetId: text("tweet_id").notNull().unique(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  handle: text("handle").notNull(),
  createdAt: timestamp("created_at").notNull(),
  likes: integer("likes").notNull().default(0),
  retweets: integer("retweets").notNull().default(0),
  replies: integer("replies").notNull().default(0),
  imageUrl: text("image_url"),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMotorcycleCategorySchema = createInsertSchema(motorcycleCategories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sizes: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Sizes must be a valid JSON array"),
  colors: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Colors must be a valid JSON array"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertGearProductSchema = createInsertSchema(gearProducts).omit({
  id: true,
});

export const insertTwitterPostSchema = createInsertSchema(twitterPosts).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMotorcycleCategory = z.infer<typeof insertMotorcycleCategorySchema>;
export type MotorcycleCategory = typeof motorcycleCategories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;

export type InsertGearProduct = z.infer<typeof insertGearProductSchema>;
export type GearProduct = typeof gearProducts.$inferSelect;

export type InsertTwitterPost = z.infer<typeof insertTwitterPostSchema>;
export type TwitterPost = typeof twitterPosts.$inferSelect;
