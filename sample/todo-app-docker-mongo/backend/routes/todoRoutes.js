// routes/todoRoutes.js
/**
 * ROUTES LAYER
 *
 * Định nghĩa API endpoints và map với controller methods
 */

const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');
const { protect } = require('../middleware/auth');

// Áp dụng auth middleware cho tất cả routes
router.use(protect);

// GET /api/todos/stats - Phải đặt TRƯỚC /:id route
router.get('/stats', TodoController.getTodoStats);

// CRUD routes
router.get('/', TodoController.getAllTodos);
router.get('/:id', TodoController.getTodoById);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.patch('/:id/toggle', TodoController.toggleTodo);
router.patch('/:id/toggle-star', TodoController.toggleStar);
router.patch('/:id/snooze', TodoController.snoozeTodo);
router.patch('/:id/unsnooze', TodoController.unsnoozeTodo);
router.delete('/bulk', TodoController.deleteBulkTodos);
router.delete('/:id', TodoController.deleteTodo);
router.delete('/', TodoController.deleteCompletedTodos);

module.exports = router;
