import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { checkStudentExists } from '../controllers/userController.js';

const router = express.Router();

// Check if a user exists as a student
router.post('/check-student', authMiddleware, checkStudentExists);

export default router;
