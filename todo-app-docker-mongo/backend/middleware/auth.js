// middleware/auth.js
/**
 * Authentication Middleware
 */

const AuthService = require('../services/AuthService');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token và get user
      const user = await AuthService.verifyToken(token);

      // Attach user to request
      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập. Vui lòng đăng nhập'
    });
  }
};

module.exports = { protect };
