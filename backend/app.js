import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import menuRoute from "./routes/menuRoute.js";
import menuItemRoute from "./routes/menuItemRoute.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import statsRoute from "./routes/statsRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";

// Import MenuItem model for public route
import MenuItem from "./models/menuItem.js";

dotenv.config();
console.log("===== NEW DEPLOY 2026-08-01 =====");
console.log("CLIENT_URL =", process.env.CLIENT_URL);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ========== IMPORTANT: UPDATED CORS ==========
const allowedOrigins = [
  "https://bites-hwqf.onrender.com",
  "https://bites-frontend-kaal.onrender.com", // ← Your frontend URL
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// ========== PUBLIC MENU ENDPOINT ==========
app.get("/api/menu/public", async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    console.log(`📋 Served ${items.length} menu items to public`);
    res.json(items);
  } catch (error) {
    console.error("Error fetching public menu:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/menus", menuRoute);
app.use("/api/menu-items", menuItemRoute);
app.use("/api/reservations", reservationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoute);
app.use("/api/reviews", reviewRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

export default app;
