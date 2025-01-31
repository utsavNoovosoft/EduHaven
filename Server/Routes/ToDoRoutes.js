import express from 'express';
import { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../Controller/TodoController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/todo', authMiddleware, createTodo);
router.get('/todo', authMiddleware, getAllTodos);
router.get('/todo/:id', authMiddleware, getTodoById);
router.put('/todo/:id', authMiddleware, updateTodo);
router.delete('/todo/:id', authMiddleware, deleteTodo);

export default router;
