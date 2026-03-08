# 🚀 Todo App - MongoDB Docker + Architecture Pattern

## 📂 Project Structure

```
todo-app-docker-mongo/
├── docker-compose.yml          # MongoDB Docker config
├── mongo-init.js               # DB initialization script
├── MONGODB_COMPASS_SETUP.md    # Hướng dẫn MongoDB Compass
├── ARCHITECTURE_FLOW.md        # Chi tiết architecture
└── backend/
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── models/
    │   ├── User.js             # User schema
    │   └── Todo.js             # Todo schema
    ├── repositories/           # DATABASE LAYER
    │   ├── UserRepository.js
    │   └── TodoRepository.js
    ├── services/               # BUSINESS LOGIC LAYER
    │   ├── AuthService.js
    │   └── TodoService.js
    ├── controllers/            # API HANDLER LAYER
    │   ├── AuthController.js
    │   └── TodoController.js
    ├── middleware/
    │   ├── auth.js
    │   └── errorHandler.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── todoRoutes.js
    └── server.js
```

---

## 🎯 Architecture: Controller → Service → Repository

```
HTTP Request
    ↓
Routes (định nghĩa endpoints)
    ↓
Controller (nhận request, extract data)
    ↓
Service (business logic, validation)
    ↓
Repository (database operations)
    ↓
Model (Mongoose schema)
    ↓
MongoDB
```

**Đọc chi tiết tại**: [ARCHITECTURE_FLOW.md](./ARCHITECTURE_FLOW.md)

---

## 🚀 Quick Start (3 bước)

### Bước 1: Start MongoDB Docker

```bash
docker-compose up -d
```

✅ MongoDB chạy tại: `localhost:27017`

### Bước 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

✅ Backend chạy tại: `http://localhost:5000`

### Bước 3: Test API

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

---

## 📊 MongoDB Compass (Xem data)

**Đọc hướng dẫn**: [MONGODB_COMPASS_SETUP.md](./MONGODB_COMPASS_SETUP.md)

**Connection String**:
```
mongodb://admin:admin123@localhost:27017/todoapp?authSource=admin
```

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Get current user

### Todos (cần authentication)
- `GET /api/todos` - Lấy tất cả todos
- `GET /api/todos/stats` - Thống kê todos
- `GET /api/todos/:id` - Lấy 1 todo
- `POST /api/todos` - Tạo todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle completed
- `DELETE /api/todos/:id` - Xóa 1 todo
- `DELETE /api/todos` - Xóa todos đã hoàn thành

---

## 🎓 Học Architecture

### VÍ DỤ: Tạo Todo mới

**Request**:
```http
POST /api/todos
Authorization: Bearer <token>

{ "title": "Học Node.js" }
```

**Flow**:

1. **Routes** (`todoRoutes.js`):
   ```javascript
   router.post('/', protect, TodoController.createTodo);
   ```

2. **Controller** (`TodoController.js`):
   ```javascript
   async createTodo(req, res) {
     const data = req.body;
     const userId = req.user.id;
     const result = await TodoService.createTodo(data, userId);
     res.status(201).json(result);
   }
   ```

3. **Service** (`TodoService.js`):
   ```javascript
   async createTodo(data, userId) {
     // Validation
     if (!data.title) throw new Error('Title required');

     // Business logic
     const todoData = { title: data.title.trim(), user: userId };

     // Call Repository
     return await TodoRepository.create(todoData);
   }
   ```

4. **Repository** (`TodoRepository.js`):
   ```javascript
   async create(todoData) {
     return await Todo.create(todoData);
   }
   ```

5. **Model** (`Todo.js`):
   ```javascript
   // Mongoose validates và saves to MongoDB
   ```

**Đọc chi tiết**: [ARCHITECTURE_FLOW.md](./ARCHITECTURE_FLOW.md)

---

## 🛠️ Docker Commands

```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# Xem logs
docker-compose logs -f mongodb

# Restart
docker-compose restart

# Xóa data
docker-compose down -v
```

---

## 💡 Tại sao dùng Architecture này?

### ✅ **Separation of Concerns**
Mỗi layer có trách nhiệm riêng biệt

### ✅ **Dễ Test**
Test từng layer độc lập

### ✅ **Reusable**
Service có thể dùng từ nhiều controllers

### ✅ **Maintainable**
Code rõ ràng, dễ đọc, dễ sửa

### ✅ **Scalable**
Dễ thêm features mới

---

## 📚 Files quan trọng

- **ARCHITECTURE_FLOW.md** - Chi tiết luồng hoạt động API
- **MONGODB_COMPASS_SETUP.md** - Setup MongoDB Compass
- **docker-compose.yml** - MongoDB Docker config
- **backend/server.js** - Entry point

---

Happy coding! 🎉
