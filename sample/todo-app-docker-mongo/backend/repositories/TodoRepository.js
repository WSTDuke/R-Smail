// repositories/TodoRepository.js
/**
 * REPOSITORY LAYER
 *
 * Chịu trách nhiệm:
 * - Tương tác TRỰC TIẾP với database (MongoDB)
 * - CRUD operations thuần túy
 * - KHÔNG chứa business logic
 * - Return raw data từ DB
 */

const Todo = require('../models/Todo');

class TodoRepository {
  /**
   * Lấy tất cả todos của 1 user theo thư mục
   * @param {String} userId - ID của user
   * @param {String} folder - Thư mục (inbox, sent, v.v.)
   * @returns {Promise<Array>} Array of todos
   */
  async findByUserIdAndFolder(userId, folder) {
    const filter = { user: userId };
    if (folder === 'starred') {
      filter.starred = true;
    } else {
      filter.folder = folder;
    }
    
    return await Todo.find(filter)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });
  }

  /**
   * Lấy 1 todo theo ID
   * @param {String} todoId - ID của todo
   * @returns {Promise<Object|null>} Todo object hoặc null
   */
  async findById(todoId) {
    return await Todo.findById(todoId)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');
  }

  /**
   * Tạo todo mới
   * @param {Object} todoData - { title, userId }
   * @returns {Promise<Object>} Todo vừa tạo
   */
  async create(todoData) {
    return await Todo.create(todoData);
  }

  /**
   * Update todo
   * @param {String} todoId - ID của todo
   * @param {Object} updateData - Data cần update
   * @returns {Promise<Object|null>} Updated todo
   */
  async update(todoId, updateData) {
    return await Todo.findByIdAndUpdate(
      todoId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('sender', 'name email')
    .populate('recipient', 'name email');
  }

  /**
   * Xóa todo
   * @param {String} todoId - ID của todo
   * @returns {Promise<Object|null>} Deleted todo
   */
  async delete(todoId) {
    return await Todo.findByIdAndDelete(todoId);
  }

  /**
   * Xóa nhiều todos (theo điều kiện)
   * @param {Object} filter - Filter condition
   * @returns {Promise<Object>} { deletedCount }
   */
  async deleteMany(filter) {
    return await Todo.deleteMany(filter);
  }

  /**
   * Đếm số lượng todos
   * @param {Object} filter - Filter condition
   * @returns {Promise<Number>} Count
   */
  async count(filter) {
    return await Todo.countDocuments(filter);
  }

  /**
   * Toggle completed status
   * @param {String} todoId - ID của todo
   * @returns {Promise<Object|null>} Updated todo
   */
  async toggleCompleted(todoId) {
    const todo = await this.findById(todoId);
    if (!todo) return null;

    todo.completed = !todo.completed;
    await todo.save();
    
    // Repopulate after save
    return await Todo.findById(todo._id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');
  }
}

module.exports = new TodoRepository();
