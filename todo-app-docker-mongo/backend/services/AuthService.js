// services/AuthService.js
/**
 * AUTH SERVICE
 *
 * Business logic cho authentication
 */

const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  }

  /**
   * Register user mới
   */
  async register(userData) {
    const { name, email, password } = userData;

    // Validation
    if (!name || !email || !password) {
      const error = new Error('Vui lòng điền đầy đủ thông tin');
      error.statusCode = 400;
      throw error;
    }

    // Check email exists
    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      const error = new Error('Email đã được sử dụng');
      error.statusCode = 400;
      throw error;
    }

    // Create user (password tự động hash trong model hook)
    const user = await UserRepository.create({ name, email, password });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    };
  }

  /**
   * Login
   */
  async login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      const error = new Error('Vui lòng nhập email và mật khẩu');
      error.statusCode = 400;
      throw error;
    }

    // Find user with password
    const user = await UserRepository.findByEmailWithPassword(email);

    if (!user) {
      const error = new Error('Email hoặc mật khẩu không đúng');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      const error = new Error('Email hoặc mật khẩu không đúng');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = this.generateToken(user._id);

    return {
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      const error = new Error('User không tồn tại');
      error.statusCode = 401;
      throw error;
    }

    return {
      success: true,
      data: user
    };
  }

  /**
   * Verify token và return user
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        throw new Error('User không tồn tại');
      }

      return user;
    } catch (error) {
      const err = new Error('Token không hợp lệ hoặc đã hết hạn');
      err.statusCode = 401;
      throw err;
    }
  }
}

module.exports = new AuthService();
