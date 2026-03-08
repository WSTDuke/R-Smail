// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose CastError
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Không tìm thấy tài nguyên';
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} đã tồn tại trong hệ thống`;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  console.error('❌ Error:', { message: err.message, statusCode });
};

module.exports = errorHandler;
