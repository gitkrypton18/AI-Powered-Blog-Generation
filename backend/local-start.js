import connectDB from "./config/db.js";
import "./src/server.js";

// Initialize database connection
connectDB().then(() => {
  console.log("Database connection patched successfully for local development.");
}).catch(err => {
  console.error("Database connection failed:", err);
});
