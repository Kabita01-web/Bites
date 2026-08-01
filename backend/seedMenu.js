/**
 * Seed script — inserts additional menu items into MongoDB
 *
 * Run with: node seedMenu.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import MenuItem from "./models/menuItem.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bites";

const menuItems = [
  // ---------------- food ----------------
  {
    name: "Crispy Momo Platter",
    description:
      "Steamed dumplings pan-seared to a golden crisp, served with a smoky tomato-sesame chutney.",
    price: 280,
    category: "food",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80",
    tags: ["popular"],
  },
  {
    name: "Grilled Chicken Burger",
    description:
      "Char-grilled chicken thigh, lettuce, tomato, and house mayo on a toasted brioche bun, served with fries.",
    price: 420,
    category: "food",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  },
  {
    name: "Wood-Fired Margherita Pizza",
    description:
      "San Marzano tomato sauce, fresh mozzarella, and basil on a thin, blistered crust.",
    price: 480,
    category: "food",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    tags: ["vegetarian"],
  },
  {
    name: "Creamy Chicken Alfredo",
    description:
      "Fettuccine tossed in a parmesan cream sauce with grilled chicken and cracked black pepper.",
    price: 460,
    category: "food",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80",
  },
  {
    name: "Spicy Korean Fried Chicken",
    description:
      "Double-fried chicken glazed in a sweet-and-spicy gochujang sauce, topped with sesame seeds.",
    price: 440,
    category: "food",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=800&q=80",
    tags: ["spicy"],
  },

  // ---------------- side ----------------
  {
    name: "Loaded Nachos",
    description:
      "House-made tortilla chips topped with melted cheddar, jalapeños, black beans, and pico de gallo.",
    price: 320,
    category: "side",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80",
  },
  {
    name: "Garlic Butter Mushrooms",
    description:
      "Pan-roasted button mushrooms finished with garlic butter, thyme, and a squeeze of lemon.",
    price: 260,
    category: "side",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
    tags: ["vegetarian"],
  },

  // ---------------- dessert ----------------
  {
    name: "Molten Chocolate Lava Cake",
    description:
      "Warm chocolate cake with a soft, oozing center, served with a scoop of vanilla ice cream.",
    price: 250,
    category: "dessert",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
  },
  {
    name: "New York Cheesecake",
    description:
      "Rich and creamy baked cheesecake on a buttery graham cracker crust, topped with berry compote.",
    price: 240,
    category: "dessert",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
  },

  // ---------------- beverage ----------------
  {
    name: "Fresh Watermelon Cooler",
    description: "Chilled watermelon juice with a hint of mint and lime.",
    price: 180,
    category: "beverage",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80",
  },
  {
    name: "Iced Caramel Latte",
    description:
      "Espresso over ice with cold milk and a swirl of house-made caramel syrup.",
    price: 220,
    category: "beverage",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if items already exist
    const existingItems = await MenuItem.countDocuments();
    if (existingItems > 0) {
      console.log(`⚠️  Database already has ${existingItems} menu items.`);
      console.log("📝 Skipping seed to avoid duplicates.");
      console.log("💡 To re-seed, run: node seedMenu.js --force");

      // Check if --force flag is used
      if (process.argv.includes("--force")) {
        console.log("🗑️  Removing existing items...");
        await MenuItem.deleteMany({});
        console.log("✅ Old items removed");
      } else {
        await mongoose.disconnect();
        return;
      }
    }

    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${inserted.length} menu items successfully!`);

    // Log the first few items
    console.log("\n📋 Added items:");
    inserted.slice(0, 5).forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - Rs. ${item.price}`);
    });
    if (inserted.length > 5) {
      console.log(`  ... and ${inserted.length - 5} more items`);
    }
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the seed function
seed();
