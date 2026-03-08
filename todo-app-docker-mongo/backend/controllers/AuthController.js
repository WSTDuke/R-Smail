// controllers/AuthController.js
/**
 * AUTH CONTROLLER
 */

const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * @route   POST /api/auth/register
   * @desc    Đăng ký user mới
   * @access  Public
   */
  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   POST /api/auth/login
   * @desc    Đăng nhập
   * @access  Public
   */
  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode);
      }
      next(error);
    }
  }

  /**
   * @route   GET /api/auth/me
   * @desc    Lấy thông tin user hiện tại
   * @access  Private
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/auth/users
   * @desc    Lấy tất cả user
   * @access  Private
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await UserRepository.findAll();
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
