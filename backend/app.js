import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import menuRoute from "./routes/menuRoute.js";
import menuItemRoute from "./routes/menuItemRoute.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/menus", menuRoute);
app.use("/api/menu-items", menuItemRoute);
app.use("/api/reservations", reservationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
