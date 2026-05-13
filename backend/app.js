import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
