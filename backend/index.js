// index.js
import express from "express";
import taskRoutes from "./routes/taskRoutes.js"; // Import the routes
import connection from "./config/db.js"; // MongoDB connection
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connection(); // Connect to MongoDB
    app.use("/api", taskRoutes); // Use the routes after DB connection
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer(); // Start the server
