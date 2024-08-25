import express from 'express';
import { addExpense, getExpensesForUser } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Route to get expenses for a specific user by username
router.get('/expenses/:username', authenticateToken, getExpensesForUser);
router.post('/expenses/addexpense/:userId', authenticateToken, addExpense);

export default router;
