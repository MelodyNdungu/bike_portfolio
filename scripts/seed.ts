import { db } from "../server/db";
import { gearProducts, twitterPosts } from "../shared/schema";

async function seedDatabase() {
  try {
    console.log('Seeding gear products...');
    await db.insert(gearProducts).values([
      {
        name: 'Adventure Helmets',
        description: 'Premium dual-sport helmets for adventure touring',
        category: 'helmets',
        priceMin: 8500,
        priceMax: 65000,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        inStock: true,
      },
      {
        name: 'Riding Jackets & Pants',
        description: 'Waterproof adventure riding gear with armor protection',
        category: 'protection',
        priceMin: 12000,
        priceMax: 45000,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        inStock: true,
      },
      {
        name: 'Adventure Boots & Gloves',
        description: 'Durable off-road boots and all-weather riding gloves',
        category: 'accessories',
        priceMin: 6500,
        priceMax: 28000,
        imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        inStock: true,
      },
      {
        name: 'Navigation & Communication',
        description: 'GPS units, intercoms, and motorcycle tech accessories',
        category: 'tech',
        priceMin: 3500,
        priceMax: 55000,
        imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        inStock: true,
      },
      {
        name: 'Maintenance & Tools',
        description: 'Essential motorcycle maintenance tools and spare parts',
        category: 'tools',
        priceMin: 2500,
        priceMax: 18000,
        imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        inStock: true,
      },
      {
        name: 'Adventure Luggage',
        description: 'Panniers, top boxes, and touring luggage systems',
        category: 'touring',
        priceMin: 8000,
        priceMax: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        inStock: true,
      },
    ]);

    console.log('Seeding Twitter posts...');
    await db.insert(twitterPosts).values([
      {
        tweetId: 'tweet_001',
        content: 'Hello, aspiring biker! 🏍️\n\nChoosing the right motorcycle isn\'t just about picking a model, it\'s about finding the perfect fit for your needs & budget. I offer consultation sessions to guide you through essential factors such as:\n✅ Motorcycle types – Which suits your riding style?',
        author: 'NduthiGear',
        handle: 'nduthigear',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        retweets: 8,
        replies: 5,
        imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      },
      {
        tweetId: 'tweet_002',
        content: 'Adventure bike spotlight: BMW GS series vs Honda Africa Twin 🏁\n\nBoth are excellent choices for Kenya\'s diverse terrain:\n- BMW: Superior electronics, premium feel\n- Honda: Better value, proven reliability\n\nWhich would you choose for your next adventure?',
        author: 'NduthiGear',
        handle: 'nduthigear',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 42,
        retweets: 15,
        replies: 12,
        imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      },
      {
        tweetId: 'tweet_003',
        content: 'Safety tip for new riders: Your gear is just as important as your skills! 🛡️\n\n Essential protective equipment:\n• DOT/ECE approved helmet\n• Armored jacket & pants\n• Quality boots & gloves\n• Back protector\n\nYour life is worth the investment. #RideSafe',
        author: 'NduthiGear',
        handle: 'nduthigear',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 67,
        retweets: 28,
        replies: 9,
        imageUrl: null,
      },
      {
        tweetId: 'tweet_004',
        content: 'Confidence riding tip: Master the basics before attempting advanced maneuvers! 💪\n\nStart with:\n1. Smooth throttle control\n2. Progressive braking\n3. Body positioning\n4. Looking where you want to go\n\nBook a confidence session if you need guidance!',
        author: 'NduthiGear',
        handle: 'nduthigear',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        likes: 38,
        retweets: 19,
        replies: 7,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      },
      {
        tweetId: 'tweet_005',
        content: 'Maintenance Monday! 🔧\n\nRegular maintenance keeps you safe and saves money:\n• Check tire pressure weekly\n• Clean & lube chain every 500km\n• Oil changes every 3,000km\n• Brake inspection monthly\n\nYour bike will thank you with reliable performance!',
        author: 'NduthiGear',
        handle: 'nduthigear',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        likes: 29,
        retweets: 11,
        replies: 4,
        imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();