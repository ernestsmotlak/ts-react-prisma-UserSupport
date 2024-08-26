import express from 'express';
import { addExpense, getExpensesForUser, updateExpense, updateExpense2 } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/authMiddleware';
import {createGroup} from '../controllers/groupController';

const router = express.Router();

router.post('/:creatorId', authenticateToken, createGroup);

export default router;