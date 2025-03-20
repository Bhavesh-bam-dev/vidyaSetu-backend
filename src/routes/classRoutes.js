import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createClass, enrollMoreStudents, getClassById, getStudentClasses } from '../controllers/classController.js';

const router = express.Router();

router.post('/classes', authMiddleware, createClass);
router.get('/classes/:classId', authMiddleware, getClassById);
router.get('/classes', authMiddleware, getStudentClasses);
router.post('/classes/:classId/enroll', authMiddleware, enrollMoreStudents);

export default router;
