import "dotenv/config";
import { Pool } from 'pg';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

async function seedStore() {
  try {
    console.log("🌱 Seeding motorcycle categories...");
    
    // Insert motorcycle categories
    const categories = [
      {
        name: "Sport",
        description: "High-performance bikes for speed enthusiasts and track riders",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800"
      },
      {
        name: "Cruiser",
        description: "Comfortable, laid-back riding style for long-distance touring",
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
      },
      {
        name: "Adventure",
        description: "Versatile bikes for on-road and off-road exploration",
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800"
      },
      {
        name: "Touring",
        description: "Long-distance comfort with storage and weather protection",
        imageUrl: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800"
      }
    ];

    for (const cat of categories) {
      await pool.query(
        `INSERT INTO motorcycle_categories (name, description, image_url) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (name) DO NOTHING`,
        [cat.name, cat.description, cat.imageUrl]
      );
    }

    console.log("✅ Categories seeded");
    console.log("🌱 Seeding products...");

    // Get category IDs
    const { rows: catRows } = await pool.query("SELECT id, name FROM motorcycle_categories");
    const categoryMap = Object.fromEntries(catRows.map((r: any) => [r.name, r.id]));

    // Insert products
    const products = [
      // Sport Helmets
      {
        name: "AGV Pista GP RR",
        description: "Professional racing helmet with carbon fiber shell and advanced aerodynamics",
        productType: "helmet",
        price: "208000.00",
        motorcycleCategoryId: categoryMap["Sport"],
        brand: "AGV",
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
        colors: JSON.stringify(["Carbon", "White", "Black"]),
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        stockQuantity: 15,
        featured: true
      },
      {
        name: "Shoei X-Fourteen",
        description: "Premium sport helmet with exceptional ventilation and comfort",
        productType: "helmet",
        price: "110500.00",
        motorcycleCategoryId: categoryMap["Sport"],
        brand: "Shoei",
        sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
        colors: JSON.stringify(["Matte Black", "White", "Red"]),
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80",
        stockQuantity: 20,
        featured: true
      },
      // Cruiser Helmets
      {
        name: "Bell Custom 500",
        description: "Classic open-face helmet with vintage styling",
        productType: "helmet",
        price: "26000.00",
        motorcycleCategoryId: categoryMap["Cruiser"],
        brand: "Bell",
        sizes: JSON.stringify(["S", "M", "L", "XL"]),
        colors: JSON.stringify(["Black", "White", "Bronze"]),
        imageUrl: "https://images.unsplash.com/photo-1592522957491-f1796b0d5d25?w=800&q=80",
        stockQuantity: 25,
        featured: false
      },
      // Adventure Helmets
      {
        name: "Arai XD-4",
        description: "Dual-sport helmet perfect for adventure riding",
        productType: "helmet",
        price: "95000.00",
        motorcycleCategoryId: categoryMap["Adventure"],
        brand: "Arai",
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
        colors: JSON.stringify(["White", "Black", "Yellow"]),
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
        stockQuantity: 18,
        featured: true
      },
      // Sport Jackets
      {
        name: "Dainese Racing 4",
        description: "Professional leather racing jacket with CE armor",
        productType: "jacket",
        price: "117000.00",
        motorcycleCategoryId: categoryMap["Sport"],
        brand: "Dainese",
        sizes: JSON.stringify(["46", "48", "50", "52", "54", "56"]),
        colors: JSON.stringify(["Black/White", "Black/Red"]),
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
        stockQuantity: 12,
        featured: true
      },
      {
        name: "Alpinestars GP Plus R v3",
        description: "Track-ready leather jacket with advanced protection",
        productType: "jacket",
        price: "84500.00",
        motorcycleCategoryId: categoryMap["Sport"],
        brand: "Alpinestars",
        sizes: JSON.stringify(["46", "48", "50", "52", "54", "56", "58"]),
        colors: JSON.stringify(["Black", "Black/White", "Black/Red"]),
        imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
        stockQuantity: 15,
        featured: true
      },
      // Cruiser Jackets
      {
        name: "Schott Perfecto 618",
        description: "Iconic leather motorcycle jacket with timeless style",
        productType: "jacket",
        price: "103500.00",
        motorcycleCategoryId: categoryMap["Cruiser"],
        brand: "Schott",
        sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
        colors: JSON.stringify(["Black", "Brown"]),
        imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
        stockQuantity: 10,
        featured: false
      },
      // Adventure Jackets
      {
        name: "Klim Badlands Pro",
        description: "Premium adventure jacket with Gore-Tex protection",
        productType: "jacket",
        price: "143000.00",
        motorcycleCategoryId: categoryMap["Adventure"],
        brand: "Klim",
        sizes: JSON.stringify(["S", "M", "L", "XL", "XXL", "3XL"]),
        colors: JSON.stringify(["Black", "Gray", "Sage"]),
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        stockQuantity: 8,
        featured: true
      },
      {
        name: "Rev'it Cayenne Pro",
        description: "All-season adventure jacket with laminated construction",
        productType: "jacket",
        price: "110500.00",
        motorcycleCategoryId: categoryMap["Adventure"],
        brand: "Rev'it",
        sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
        colors: JSON.stringify(["Black", "Sand", "Blue"]),
        imageUrl: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80",
        stockQuantity: 14,
        featured: false
      },
      // Touring Jackets
      {
        name: "BMW Rallye Suit",
        description: "Premium touring jacket with maximum comfort and protection",
        productType: "jacket",
        price: "169000.00",
        motorcycleCategoryId: categoryMap["Touring"],
        brand: "BMW",
        sizes: JSON.stringify(["48", "50", "52", "54", "56", "58"]),
        colors: JSON.stringify(["Black", "Gray", "Blue"]),
        imageUrl: "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&q=80",
        stockQuantity: 6,
        featured: false
      }
    ];

    for (const product of products) {
      await pool.query(
        `INSERT INTO products 
         (name, description, product_type, price, motorcycle_category_id, brand, sizes, colors, image_url, stock_quantity, featured, in_stock) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          product.name,
          product.description,
          product.productType,
          product.price,
          product.motorcycleCategoryId,
          product.brand,
          product.sizes,
          product.colors,
          product.imageUrl,
          product.stockQuantity,
          product.featured,
          true
        ]
      );
    }

    console.log("✅ Products seeded");
    console.log("🎉 Store seeding complete!");
    console.log(`   - 4 motorcycle categories`);
    console.log(`   - ${products.length} products`);
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedStore();
