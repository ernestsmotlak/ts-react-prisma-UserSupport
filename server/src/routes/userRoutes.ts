import express from 'express';
import { getUserById } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users/:id', authenticateToken, getUserById);

export default router;
