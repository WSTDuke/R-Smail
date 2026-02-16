// services/TodoService.js
/**
 * SERVICE LAYER
 *
 * Chịu trách nhiệm:
 * - BUSINESS LOGIC của app
 * - Validation phức tạp
 * - Transform data
 * - Orchestrate nhiều repository calls
 * - KHÔNG tương tác trực tiếp với database (dùng repository)
 */

const TodoRepository = require('../repositories/TodoRepository');

class TodoService {
  /**
   * Lấy tất cả todos của user
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, count, data }
   */
  async getUserTodos(userId) {
    const todos = await TodoRepository.findByUserId(userId);

    return {
      success: true,
      count: todos.length,
      data: todos
    };
  }

  /**
   * Lấy 1 todo (với authorization check)
   * @param {String} todoId - ID của todo
   * @param {String} userId - ID của user hiện tại
   * @returns {Promise<Object>} { success, data }
   */
  async getTodoById(todoId, userId) {
    const todo = await TodoRepository.findById(todoId);

    if (!todo) {
      throw new Error('Todo không tồn tại');
    }

    // BUSINESS LOGIC: Check authorization
    if (todo.user.toString() !== userId) {
      const error = new Error('Bạn không có quyền truy cập todo này');
      error.statusCode = 403;
      throw error;
    }

    return {
      success: true,
      data: todo
    };
  }

  /**
   * Tạo todo mới
   * @param {Object} data - { title }
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, data }
   */
  async createTodo(data, userId) {
    // BUSINESS LOGIC: Validation
    if (!data.title || data.title.trim() === '') {
      const error = new Error('Vui lòng nhập nội dung todo');
      error.statusCode = 400;
      throw error;
    }

    // BUSINESS LOGIC: Transform data
    const todoData = {
      title: data.title.trim(),
      user: userId,
      completed: false
    };

    const todo = await TodoRepository.create(todoData);

    return {
      success: true,
      data: todo
    };
  }

  /**
   * Update todo
   * @param {String} todoId - ID của todo
   * @param {Object} updateData - { title?, completed? }
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, data }
   */
  async updateTodo(todoId, updateData, userId) {
    // Check todo tồn tại và authorization
    const todo = await TodoRepository.findById(todoId);

    if (!todo) {
      throw new Error('Todo không tồn tại');
    }

    if (todo.user.toString() !== userId) {
      const error = new Error('Bạn không có quyền sửa todo này');
      error.statusCode = 403;
      throw error;
    }

    // BUSINESS LOGIC: Only update allowed fields
    const allowedUpdates = {};
    if (updateData.title !== undefined) {
      allowedUpdates.title = updateData.title.trim();
    }
    if (updateData.completed !== undefined) {
      allowedUpdates.completed = updateData.completed;
    }

    const updatedTodo = await TodoRepository.update(todoId, allowedUpdates);

    return {
      success: true,
      data: updatedTodo
    };
  }

  /**
   * Toggle completed status
   * @param {String} todoId - ID của todo
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, data }
   */
  async toggleTodo(todoId, userId) {
    // Check authorization
    const todo = await TodoRepository.findById(todoId);

    if (!todo) {
      throw new Error('Todo không tồn tại');
    }

    if (todo.user.toString() !== userId) {
      const error = new Error('Bạn không có quyền sửa todo này');
      error.statusCode = 403;
      throw error;
    }

    const updatedTodo = await TodoRepository.toggleCompleted(todoId);

    return {
      success: true,
      data: updatedTodo
    };
  }

  /**
   * Xóa todo
   * @param {String} todoId - ID của todo
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, message }
   */
  async deleteTodo(todoId, userId) {
    // Check authorization
    const todo = await TodoRepository.findById(todoId);

    if (!todo) {
      throw new Error('Todo không tồn tại');
    }

    if (todo.user.toString() !== userId) {
      const error = new Error('Bạn không có quyền xóa todo này');
      error.statusCode = 403;
      throw error;
    }

    await TodoRepository.delete(todoId);

    return {
      success: true,
      message: 'Todo đã được xóa'
    };
  }

  /**
   * Xóa todos đã hoàn thành
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, message, deletedCount }
   */
  async deleteCompletedTodos(userId) {
    const result = await TodoRepository.deleteMany({
      user: userId,
      completed: true
    });

    return {
      success: true,
      message: `Đã xóa ${result.deletedCount} todos`,
      deletedCount: result.deletedCount
    };
  }

  /**
   * Lấy thống kê todos
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, data }
   */
  async getTodoStats(userId) {
    const total = await TodoRepository.count({ user: userId });
    const completed = await TodoRepository.count({ user: userId, completed: true });

    return {
      success: true,
      data: {
        total,
        completed,
        active: total - completed,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
      }
    };
  }
}

module.exports = new TodoService();
