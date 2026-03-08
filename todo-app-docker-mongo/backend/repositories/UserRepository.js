// repositories/UserRepository.js
/**
 * USER REPOSITORY
 *
 * Tương tác với User collection trong MongoDB
 */

const User = require('../models/User');

class UserRepository {
  /**
   * Tìm user theo email
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Tìm user theo ID
   */
  async findById(userId) {
    return await User.findById(userId);
  }

  /**
   * Tìm user theo ID và include password
   */
  async findByIdWithPassword(userId) {
    return await User.findById(userId).select('+password');
  }

  /**
   * Tìm user theo email và include password
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password');
  }

  /**
   * Tạo user mới
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Update user
   */
  async update(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * Xóa user
   */
  async delete(userId) {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Lấy tất cả user
   */
  async findAll() {
    return await User.find({}).select('name email');
  }
}

module.exports = new UserRepository();
