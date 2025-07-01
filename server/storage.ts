import { 
  users, 
  consultations, 
  gearProducts, 
  twitterPosts,
  type User, 
  type InsertUser,
  type Consultation,
  type InsertConsultation,
  type GearProduct,
  type InsertGearProduct,
  type TwitterPost,
  type InsertTwitterPost
} from "@shared/schema";

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
  }

  private seedGearProducts() {
    const products: InsertGearProduct[] = [
      {
        name: "Premium Helmets",
        description: "DOT and ECE certified helmets from top brands",
        category: "helmets",
        priceMin: 120,
        priceMax: 800,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
      {
        name: "Protective Gear",
        description: "Armored jackets, pants, and protective equipment",
        category: "protection",
        priceMin: 80,
        priceMax: 500,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
      {
        name: "Gloves & Boots",
        description: "Durable gloves and boots for all-weather riding",
        category: "accessories",
        priceMin: 45,
        priceMax: 300,
        imageUrl: "https://pixabay.com/get/g99f2081269647da7cb41a8f935d8700f375c8bf4914acc2ee5d708a8927638d7ff8cedc823878b8b8f05fc5e1d5e86e6b2c2d5535c577df40e500465e27c1d23_1280.jpg",
        inStock: true,
      },
      {
        name: "Tech & Accessories",
        description: "GPS, communication systems, and tech upgrades",
        category: "tech",
        priceMin: 25,
        priceMax: 600,
        imageUrl: "https://pixabay.com/get/g2707f859787d7faf4231e5cd0b571aab71c045f4ee3fbe3f9160c3dd41ce511fccbefb39687a8de5c0de698b99a103346fa4f63276ac55e9a9bcdd1022c36a16_1280.jpg",
        inStock: true,
      },
      {
        name: "Maintenance Tools",
        description: "Essential tools and supplies for bike maintenance",
        category: "tools",
        priceMin: 15,
        priceMax: 200,
        imageUrl: "https://pixabay.com/get/g6b3e1a477f4345349a894f0e8f45cf59bca3e73b4e4b16fa070d1460c99359e877a045b66164292d799d6a11d979a0b97315bbd2fa62af1acf1c6717a5937d99_1280.jpg",
        inStock: true,
      },
      {
        name: "Touring Gear",
        description: "Luggage, saddlebags, and long-distance accessories",
        category: "touring",
        priceMin: 50,
        priceMax: 400,
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        inStock: true,
      },
    ];

    products.forEach(product => {
      this.createGearProduct(product);
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
    const gearProduct: GearProduct = { ...insertGearProduct, id };
    this.gearProducts.set(id, gearProduct);
    return gearProduct;
  }

  async getTwitterPosts(): Promise<TwitterPost[]> {
    return Array.from(this.twitterPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTwitterPost(insertTwitterPost: InsertTwitterPost): Promise<TwitterPost> {
    const id = this.currentTwitterPostId++;
    const twitterPost: TwitterPost = { ...insertTwitterPost, id };
    this.twitterPosts.set(id, twitterPost);
    return twitterPost;
  }

  async getLatestTwitterPosts(limit: number): Promise<TwitterPost[]> {
    const posts = await this.getTwitterPosts();
    return posts.slice(0, limit);
  }
}

export const storage = new MemStorage();
