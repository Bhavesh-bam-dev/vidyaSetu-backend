import pkg from "jsonwebtoken";
const { verify } = pkg;
import { config } from "dotenv";
import User from "../models/User.js";

config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing" });
  }

  verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(decoded.userId); // Find the user by ID from the token payload
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user info to the request object
    next();
  });
};

export default authenticateJWT;
