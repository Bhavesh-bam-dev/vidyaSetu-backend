import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkStudentExists, getStudentSuggestions } from '../controllers/userController.js';

const router = express.Router();

// Check if a user exists as a student
router.post('/check-student', authMiddleware, checkStudentExists);
router.get('/student-suggestions', authMiddleware, getStudentSuggestions);

export default router;
