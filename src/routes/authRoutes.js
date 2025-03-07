import { Router } from "express";
const router = Router();
import authController from "../controllers/authController.js";
const { register, login } = authController;
import authenticateJWT from "../middleware/authMiddleware.js";

// User Registration Route
router.post("/register", register);

// User Login Route
router.post("/login", login);

// Protected Route (Example)
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({
    message: "This is your profile data",
    user: req.user,
  });
});

export default router;
