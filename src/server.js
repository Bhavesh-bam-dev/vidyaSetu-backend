import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// Start server and sync database
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
