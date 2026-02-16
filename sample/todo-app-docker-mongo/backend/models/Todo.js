// models/Todo.js
// MongoDB Model cho Todo
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung todo'],
      trim: true,
      maxlength: [200, 'Todo không được quá 200 ký tự']
    },
    completed: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index để query nhanh
todoSchema.index({ user: 1 });

module.exports = mongoose.model('Todo', todoSchema);
