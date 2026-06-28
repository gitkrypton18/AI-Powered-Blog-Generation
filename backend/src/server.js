// src/server.js - MINIMAL VERSION FOR TESTING
// This version has NO route imports to test if that's the problem

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import connectDB from "../config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.head('/health', (req, res) => {
  res.status(200).end(); 
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({ message: "API is working successfully!" });
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

// Simple 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
});

// Only listen locally (not on Vercel)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to connect to database:", err);
  });
}

export default app;