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
const UserRepository = require('../repositories/UserRepository');

class TodoService {
  /**
   * Lấy tất cả todos của user theo thư mục
   * @param {String} userId - ID của user
   * @param {String} folder - Thư mục (inbox, sent,Starred, v.v.)
   * @returns {Promise<Object>} { success, count, data }
   */
  async getUserTodos(userId, folder = 'inbox') {
    const todos = await TodoRepository.findByUserIdAndFolder(userId, folder);

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
   * Tạo todo mới hoặc gửi thư
   * @param {Object} data - { title, description?, recipientEmail? }
   * @param {String} userId - ID của user gửi
   * @returns {Promise<Object>} { success, data }
   */
  async createTodo(data, userId) {
    // BUSINESS LOGIC: Validation
    if (!data.title || data.title.trim() === '') {
      const error = new Error('Vui lòng nhập nội dung todo');
      error.statusCode = 400;
      throw error;
    }

    const title = data.title.trim();
    const description = data.description || '';
    const recipientEmail = data.recipientEmail;

    console.log('--- SENTINEL: TodoService.createTodo START ---');
    console.log('Data received:', { title, recipientEmail, userId });

    let resultTodo;

    if (recipientEmail && typeof recipientEmail === 'string' && recipientEmail.trim() !== '') {
      console.log('--- SENTINEL: ENTERING MAIL BRANCH ---');
      const emailToFind = recipientEmail.trim();
      const recipient = await UserRepository.findByEmail(emailToFind);
      
      if (!recipient) {
        console.log(`--- SENTINEL: RECIPIENT NOT FOUND (${emailToFind}) ---`);
        const error = new Error(`KHÔNG TÌM THẤY: Email "${emailToFind}" chưa có trên hệ thống`);
        error.statusCode = 404;
        throw error;
      }

      const recipientId = recipient._id;
      console.log('Recipient found ID:', recipientId);

      // 1. Inbox cho người nhận
      await TodoRepository.create({
        title,
        description,
        user: recipientId,
        sender: userId,
        recipient: recipientId,
        folder: 'inbox',
        recipientEmail: emailToFind,
        completed: false
      });

      // 2. Sent cho người gửi
      resultTodo = await TodoRepository.create({
        title,
        description,
        user: userId,
        sender: userId,
        recipient: recipientId,
        folder: 'sent',
        recipientEmail: emailToFind,
        completed: false
      });
      console.log('--- SENTINEL: MAIL CREATED SUCCESSFULLY ---');
    } else {
      console.log('--- SENTINEL: ENTERING SYSTEM TODO BRANCH ---');
      resultTodo = await TodoRepository.create({
        title,
        description,
        user: userId,
        folder: 'inbox',
        recipientEmail: recipientEmail || 'NONE',
        completed: false
      });
      console.log('--- SENTINEL: SYSTEM TODO CREATED ---');
    }

    // Populate thông tin để frontend hiển thị đúng ngay lập tức
    if (resultTodo) {
      await resultTodo.populate([
        { path: 'sender', select: 'name email' },
        { path: 'recipient', select: 'name email' }
      ]);
    }

    return {
      success: true,
      data: resultTodo
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
    if (updateData.starred !== undefined) {
      allowedUpdates.starred = updateData.starred;
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
   * Toggle starred status
   * @param {String} todoId - ID của todo
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, data }
   */
  async toggleStar(todoId, userId) {
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

    todo.starred = !todo.starred;
    await todo.save();

    // Repopulate after save
    const populatedTodo = await TodoRepository.findById(todo._id);

    return {
      success: true,
      data: populatedTodo
    };
  }

  /**
   * Di chuyển todo vào thư mục tạm ẩn (snoozed)
   * @param {String} todoId - ID của todo
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, data }
   */
  async snoozeTodo(todoId, userId) {
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

    // Cập nhật folder thành snoozed
    const updatedTodo = await TodoRepository.update(todoId, { folder: 'snoozed' });

    return {
      success: true,
      data: updatedTodo
    };
  }

  /**
   * Hoàn tác tạm ẩn (đưa về inbox)
   * @param {String} todoId - ID của todo
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, data }
   */
  async unsnoozeTodo(todoId, userId) {
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

    // Cập nhật folder thành inbox
    const updatedTodo = await TodoRepository.update(todoId, { folder: 'inbox' });

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
   * Xóa nhiều todos theo danh sách ID
   * @param {Array} ids - List IDs của todos
   * @param {String} userId - ID của user
   * @returns {Promise<Object>} { success, message, deletedCount }
   */
  async deleteBulkTodos(ids, userId) {
    // Mặc dù deleteMany có thể dùng filter, nhưng để đảm bảo authorization 
    // chúng ta sẽ filter kỹ hơn trong filter object của deleteMany
    const result = await TodoRepository.deleteMany({
      _id: { $in: ids },
      user: userId
    });

    return {
      success: true,
      message: `Đã xóa ${result.deletedCount} mục`,
      deletedCount: result.deletedCount
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
