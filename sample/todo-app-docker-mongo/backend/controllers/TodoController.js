// controllers/TodoController.js
/**
 * CONTROLLER LAYER (API HANDLER)
 *
 * Chịu trách nhiệm:
 * - Nhận HTTP request
 * - Extract data từ req (body, params, query, user)
 * - Gọi Service để xử lý business logic
 * - Return HTTP response
 * - Handle errors và pass to error handler middleware
 */

const TodoService = require('../services/TodoService');

class TodoController {
  /**
   * @route   GET /api/todos
   * @desc    Lấy tất cả todos của user
   * @access  Private
   */
  async getAllTodos(req, res, next) {
    try {
      const userId = req.user.id;
      const folder = req.query.folder || 'inbox';
      const result = await TodoService.getUserTodos(userId, folder);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/todos/:id
   * @desc    Lấy 1 todo
   * @access  Private
   */
  async getTodoById(req, res, next) {
    try {
      const todoId = req.params.id;
      const userId = req.user.id;

      const result = await TodoService.getTodoById(todoId, userId);

      res.json(result);
    } catch (error) {
      if (error.message === 'Todo không tồn tại') {
        res.status(404);
      }
      next(error);
    }
  }

  /**
   * @route   POST /api/todos
   * @desc    Tạo todo mới
   * @access  Private
   */
  async createTodo(req, res, next) {
    try {
      const todoData = req.body;
      const userId = req.user.id;
      console.log('CONTROLLER [createTodo] body:', todoData);
      const result = await TodoService.createTodo(todoData, userId);

      res.status(201).json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   PUT /api/todos/:id
   * @desc    Update todo
   * @access  Private
   */
  async updateTodo(req, res, next) {
    try {
      const todoId = req.params.id;
      const updateData = req.body;
      const userId = req.user.id;

      const result = await TodoService.updateTodo(todoId, updateData, userId);

      res.json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   PATCH /api/todos/:id/toggle
   * @desc    Toggle completed
   * @access  Private
   */
  async toggleTodo(req, res, next) {
    try {
      const todoId = req.params.id;
      const userId = req.user.id;

      const result = await TodoService.toggleTodo(todoId, userId);

      res.json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   PATCH /api/todos/:id/toggle-star
   * @desc    Toggle starred
   * @access  Private
   */
  async toggleStar(req, res, next) {
    try {
      const todoId = req.params.id;
      const userId = req.user.id;

      const result = await TodoService.toggleStar(todoId, userId);

      res.json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   PATCH /api/todos/:id/snooze
   * @desc    Snooze todo (move to snoozed folder)
   * @access  Private
   */
  async snoozeTodo(req, res, next) {
    try {
      const todoId = req.params.id;
      const userId = req.user.id;

      const result = await TodoService.snoozeTodo(todoId, userId);

      res.json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   PATCH /api/todos/:id/unsnooze
   * @desc    Unsnooze todo (move back to inbox)
   * @access  Private
   */
  async unsnoozeTodo(req, res, next) {
    try {
      const todoId = req.params.id;
      const userId = req.user.id;

      const result = await TodoService.unsnoozeTodo(todoId, userId);

      res.json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   DELETE /api/todos/:id
   * @desc    Xóa todo
   * @access  Private
   */
  async deleteTodo(req, res, next) {
    try {
      const todoId = req.params.id;
      const userId = req.user.id;

      const result = await TodoService.deleteTodo(todoId, userId);

      res.json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   DELETE /api/todos/bulk
   * @desc    Xóa nhiều todos
   * @access  Private
   */
  async deleteBulkTodos(req, res, next) {
    try {
      const { ids } = req.body;
      const userId = req.user.id;

      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ success: false, message: 'Danh sách ID không hợp lệ' });
      }

      const result = await TodoService.deleteBulkTodos(ids, userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   DELETE /api/todos
   * @desc    Xóa todos đã hoàn thành
   * @access  Private
   */
  async deleteCompletedTodos(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await TodoService.deleteCompletedTodos(userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/todos/stats
   * @desc    Lấy thống kê todos
   * @access  Private
   */
  async getTodoStats(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await TodoService.getTodoStats(userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TodoController();
