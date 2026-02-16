// server.js
// Express server với MongoDB Docker
// Architecture: Controller → Service → Repository → Model

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// ============= MIDDLEWARE =============
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============= ROUTES =============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running with MongoDB Docker!',
    database: 'MongoDB',
    architecture: 'Controller → Service → Repository → Model',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

// ============= ERROR HANDLING =============
app.use(errorHandler);

// ============= START SERVER =============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║  🚀 Server đang chạy!                      ║
  ║  📡 Port: ${PORT}                            ║
  ║  🌍 URL: http://localhost:${PORT}           ║
  ║  🐳 Database: MongoDB Docker               ║
  ║  🏗️  Architecture: MVC + Service Layer    ║
  ╚════════════════════════════════════════════╝
  `);
});

/**
 * ARCHITECTURE FLOW:
 *
 * HTTP Request
 *    ↓
 * Routes (định nghĩa endpoints)
 *    ↓
 * Controller (nhận request, gọi service)
 *    ↓
 * Service (business logic)
 *    ↓
 * Repository (database operations)
 *    ↓
 * Model (Mongoose schema)
 *    ↓
 * MongoDB
 *    ↓
 * Response về client
 *
 * VÍ DỤ: Tạo todo mới
 *
 * POST /api/todos { title: "Learn Node" }
 *    ↓
 * todoRoutes.js → router.post('/', TodoController.createTodo)
 *    ↓
 * TodoController.createTodo()
 *   - Extract: req.body, req.user.id
 *   - Call: TodoService.createTodo(data, userId)
 *    ↓
 * TodoService.createTodo()
 *   - Validate: title không rỗng
 *   - Transform: trim title
 *   - Call: TodoRepository.create({ title, user: userId })
 *    ↓
 * TodoRepository.create()
 *   - Call: Todo.create(data)
 *    ↓
 * Todo Model (Mongoose)
 *   - Validate schema
 *   - Save to MongoDB
 *    ↓
 * MongoDB lưu document
 *    ↓
 * Return todo object
 *    ↓
 * Response: { success: true, data: todo }
 */
