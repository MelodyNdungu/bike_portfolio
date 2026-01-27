import { 
  users, 
  consultations, 
  gearProducts, 
  twitterPosts,
  motorcycleCategories,
  products,
  orders,
  orderItems,
  type User, 
  type InsertUser,
  type Consultation,
  type InsertConsultation,
  type GearProduct,
  type InsertGearProduct,
  type TwitterPost,
  type InsertTwitterPost,
  type MotorcycleCategory,
  type InsertMotorcycleCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultations(): Promise<Consultation[]>;
  
  getGearProducts(): Promise<GearProduct[]>;
  getGearProductsByCategory(category: string): Promise<GearProduct[]>;
  
  getTwitterPosts(): Promise<TwitterPost[]>;
  createTwitterPost(post: InsertTwitterPost): Promise<TwitterPost>;
  getLatestTwitterPosts(limit: number): Promise<TwitterPost[]>;
  
  // Motorcycle Categories
  getMotorcycleCategories(): Promise<MotorcycleCategory[]>;
  getMotorcycleCategoryById(id: number): Promise<MotorcycleCategory | undefined>;
  createMotorcycleCategory(category: InsertMotorcycleCategory): Promise<MotorcycleCategory>;
  updateMotorcycleCategory(id: number, category: Partial<InsertMotorcycleCategory>): Promise<MotorcycleCategory | undefined>;
  deleteMotorcycleCategory(id: number): Promise<boolean>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByType(productType: string): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db
      .insert(consultations)
      .values(insertConsultation)
      .returning();
    return consultation;
  }

  async getConsultations(): Promise<Consultation[]> {
    return await db.select().from(consultations);
  }

  async getGearProducts(): Promise<GearProduct[]> {
    return await db.select().from(gearProducts);
  }

  async getGearProductsByCategory(category: string): Promise<GearProduct[]> {
    return await db.select().from(gearProducts).where(eq(gearProducts.category, category));
  }

  async getTwitterPosts(): Promise<TwitterPost[]> {
    return await db.select().from(twitterPosts).orderBy(twitterPosts.createdAt);
  }

  async createTwitterPost(insertTwitterPost: InsertTwitterPost): Promise<TwitterPost> {
    const [post] = await db
      .insert(twitterPosts)
      .values(insertTwitterPost)
      .returning();
    return post;
  }

  async getLatestTwitterPosts(limit: number): Promise<TwitterPost[]> {
    return await db.select().from(twitterPosts).orderBy(twitterPosts.createdAt).limit(limit);
  }

  // Motorcycle Categories
  async getMotorcycleCategories(): Promise<MotorcycleCategory[]> {
    return await db.select().from(motorcycleCategories).orderBy(motorcycleCategories.name);
  }

  async getMotorcycleCategoryById(id: number): Promise<MotorcycleCategory | undefined> {
    const [category] = await db.select().from(motorcycleCategories).where(eq(motorcycleCategories.id, id));
    return category || undefined;
  }

  async createMotorcycleCategory(insertCategory: InsertMotorcycleCategory): Promise<MotorcycleCategory> {
    const [category] = await db
      .insert(motorcycleCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateMotorcycleCategory(id: number, updateData: Partial<InsertMotorcycleCategory>): Promise<MotorcycleCategory | undefined> {
    const [category] = await db
      .update(motorcycleCategories)
      .set(updateData)
      .where(eq(motorcycleCategories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteMotorcycleCategory(id: number): Promise<boolean> {
    const result = await db.delete(motorcycleCategories).where(eq(motorcycleCategories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByType(productType: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.productType, productType));
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.motorcycleCategoryId, categoryId));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true)).limit(6);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db
      .insert(orderItems)
      .values(insertItem)
      .returning();
    return item;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private consultations: Map<number, Consultation>;
  private gearProducts: Map<number, GearProduct>;
  private twitterPosts: Map<number, TwitterPost>;
  private currentUserId: number;
  private currentConsultationId: number;
  private currentGearProductId: number;
  private currentTwitterPostId: number;

  constructor() {
    this.users = new Map();
    this.consultations = new Map();
    this.gearProducts = new Map();
    this.twitterPosts = new Map();
    this.currentUserId = 1;
    this.currentConsultationId = 1;
    this.currentGearProductId = 1;
    this.currentTwitterPostId = 1;
    
    this.seedGearProducts();
    this.seedTwitterPosts();
  }

  private seedGearProducts() {
    const products: InsertGearProduct[] = [
      {
        name: "Adventure Helmets",
        description: "Premium dual sport helmets for adventure touring",
        category: "helmets",
        priceMin: 8500,
        priceMax: 65000,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
      {
        name: "Riding Jackets & Pants",
        description: "Waterproof adventure riding gear with armor protection",
        category: "protection",
        priceMin: 12000,
        priceMax: 45000,
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
      {
        name: "Adventure Boots & Gloves",
        description: "Durable off-road boots and all-weather riding gloves",
        category: "accessories",
        priceMin: 6500,
        priceMax: 28000,
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
      {
        name: "Navigation & Communication",
        description: "GPS units, intercoms, and motorcycle tech accessories",
        category: "tech",
        priceMin: 3500,
        priceMax: 55000,
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
      {
        name: "Maintenance & Tools",
        description: "Essential motorcycle maintenance tools and spare parts",
        category: "tools",
        priceMin: 2500,
        priceMax: 18000,
        imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
      {
        name: "Adventure Luggage",
        description: "Panniers, top boxes, and touring luggage systems",
        category: "touring",
        priceMin: 8000,
        priceMax: 35000,
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
    ];

    products.forEach(product => {
      this.createGearProduct(product);
    });
  }

  private seedTwitterPosts() {
    const posts: InsertTwitterPost[] = [
      {
        tweetId: "tweet_001",
        content: "Hello, aspiring biker! 🏍️\n\nChoosing the right motorcycle isn't just about picking a model, it's about finding the perfect fit for your needs & budget. I offer consultation sessions to guide you through essential factors such as:\n✅ Motorcycle types – Which suits your riding style?",
        author: "NduthiGear",
        handle: "nduthigear",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hrs ago
        likes: 24,
        retweets: 8,
        replies: 5,
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      },
      {
        tweetId: "tweet_002", 
        content: "Adventure bike spotlight: BMW GS series vs Honda Africa Twin 🏁\n\nBoth are excellent choices for Kenya's diverse terrain:\n- BMW: Superior electronics, premium feel\n- Honda: Better value, proven reliability\n\nWhich would you choose for your next adventure?",
        author: "NduthiGear",
        handle: "nduthigear", 
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hrs ago
        likes: 42,
        retweets: 15,
        replies: 12,
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      },
      {
        tweetId: "tweet_003",
        content: "Safety tip for new riders: Your gear is just as important as your skills! 🛡️\n\n Essential protective equipment:\n• DOT/ECE approved helmet\n• Armored jacket & pants\n• Quality boots & gloves\n• Back protector\n\nYour life is worth the investment. #RideSafe",
        author: "NduthiGear",
        handle: "nduthigear",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        likes: 67,
        retweets: 28,
        replies: 9,
        imageUrl: null,
      },
      {
        tweetId: "tweet_004",
        content: "Confidence riding tip: Master the basics before attempting advanced maneuvers! 💪\n\nStart with:\n1. Smooth throttle control\n2. Progressive braking\n3. Body positioning\n4. Looking where you want to go\n\nBook a confidence session if you need guidance!",
        author: "NduthiGear", 
        handle: "nduthigear",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hrs ago
        likes: 38,
        retweets: 19,
        replies: 7,
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      },
      {
        tweetId: "tweet_005",
        content: "Maintenance Monday! 🔧\n\nRegular maintenance keeps you safe and saves money:\n• Check tire pressure weekly\n• Clean & lube chain every 500km\n• Oil changes every 3,000km\n• Brake inspection monthly\n\nYour bike will thank you with reliable performance!",
        author: "NduthiGear",
        handle: "nduthigear", 
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        likes: 29,
        retweets: 11,
        replies: 4,
        imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      }
    ];

    posts.forEach(post => {
      this.createTwitterPost(post);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.currentConsultationId++;
    const consultation: Consultation = { 
      ...insertConsultation, 
      id, 
      status: "pending",
      createdAt: new Date()
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values());
  }

  async getGearProducts(): Promise<GearProduct[]> {
    return Array.from(this.gearProducts.values());
  }

  async getGearProductsByCategory(category: string): Promise<GearProduct[]> {
    return Array.from(this.gearProducts.values()).filter(
      product => product.category === category
    );
  }

  private async createGearProduct(insertGearProduct: InsertGearProduct): Promise<GearProduct> {
    const id = this.currentGearProductId++;
    const gearProduct: GearProduct = { 
      ...insertGearProduct, 
      id,
      inStock: insertGearProduct.inStock ?? true
    };
    this.gearProducts.set(id, gearProduct);
    return gearProduct;
  }

  async getTwitterPosts(): Promise<TwitterPost[]> {
    return Array.from(this.twitterPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTwitterPost(insertTwitterPost: InsertTwitterPost): Promise<TwitterPost> {
    const id = this.currentTwitterPostId++;
    const twitterPost: TwitterPost = { 
      ...insertTwitterPost, 
      id,
      likes: insertTwitterPost.likes ?? 0,
      retweets: insertTwitterPost.retweets ?? 0,
      replies: insertTwitterPost.replies ?? 0,
      imageUrl: insertTwitterPost.imageUrl ?? null
    };
    this.twitterPosts.set(id, twitterPost);
    return twitterPost;
  }

  async getLatestTwitterPosts(limit: number): Promise<TwitterPost[]> {
    const posts = await this.getTwitterPosts();
    return posts.slice(0, limit);
  }
}

export const storage = new DatabaseStorage();
