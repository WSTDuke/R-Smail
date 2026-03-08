# 🎯 LUỒNG HOẠT ĐỘNG API - SERVICE - REPOSITORY

## 🏗️ Architecture Overview

```
Client Request
    ↓
Routes (endpoint definitions)
    ↓
Controller (API handler)
    ↓
Service (business logic)
    ↓
Repository (database operations)
    ↓
Model (Mongoose schema)
    ↓
MongoDB
```

---

## 📚 Chi tiết từng layer

### 1️⃣ **MODEL** (models/Todo.js)
**Vai trò**: Định nghĩa schema và structure của data

```javascript
// Định nghĩa cấu trúc document trong MongoDB
const todoSchema = new Schema({
  title: String,
  completed: Boolean,
  user: ObjectId
});
```

**Chức năng**:
- Schema validation
- Default values
- Hooks (pre-save, post-save)
- Instance methods
- Virtual fields

---

### 2️⃣ **REPOSITORY** (repositories/TodoRepository.js)
**Vai trò**: Tương tác TRỰC TIẾP với database

```javascript
class TodoRepository {
  async findByUserId(userId) {
    return await Todo.find({ user: userId });
  }

  async create(data) {
    return await Todo.create(data);
  }
}
```

**Đặc điểm**:
- ✅ CRUD operations thuần túy
- ✅ Query database
- ❌ KHÔNG có business logic
- ❌ KHÔNG validate (để cho Service)

---

### 3️⃣ **SERVICE** (services/TodoService.js)
**Vai trò**: BUSINESS LOGIC của app

```javascript
class TodoService {
  async createTodo(data, userId) {
    // Validation
    if (!data.title) throw new Error('Title required');

    // Transform data
    const todoData = {
      title: data.title.trim(),
      user: userId
    };

    // Call Repository
    return await TodoRepository.create(todoData);
  }
}
```

**Chức năng**:
- ✅ Validation phức tạp
- ✅ Authorization checks
- ✅ Transform data
- ✅ Business rules
- ✅ Orchestrate nhiều repository calls
- ❌ KHÔNG tương tác trực tiếp với DB

---

### 4️⃣ **CONTROLLER** (controllers/TodoController.js)
**Vai trò**: API Handler - nhận request, gọi service, trả response

```javascript
class TodoController {
  async createTodo(req, res, next) {
    try {
      // Extract data từ request
      const data = req.body;
      const userId = req.user.id;

      // Gọi Service
      const result = await TodoService.createTodo(data, userId);

      // Return response
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
```

**Chức năng**:
- ✅ Extract data từ req (body, params, query)
- ✅ Gọi Service
- ✅ Return HTTP response
- ✅ Handle errors
- ❌ KHÔNG có business logic

---

### 5️⃣ **ROUTES** (routes/todoRoutes.js)
**Vai trò**: Định nghĩa API endpoints

```javascript
router.post('/', TodoController.createTodo);
router.get('/', TodoController.getAllTodos);
router.put('/:id', TodoController.updateTodo);
```

**Chức năng**:
- Map HTTP method + path → Controller method
- Apply middleware (auth, validation)

---

## 🔄 VÍ DỤ FLOW: Tạo Todo mới

### Request:
```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Học Node.js"
}
```

### Flow chi tiết:

#### **Bước 1: Routes**
```javascript
// routes/todoRoutes.js
router.post('/', protect, TodoController.createTodo);
```
- Match endpoint: POST /api/todos
- Chạy middleware `protect` (verify JWT)
- Forward đến `TodoController.createTodo`

---

#### **Bước 2: Controller**
```javascript
// controllers/TodoController.js
async createTodo(req, res, next) {
  try {
    const data = req.body;           // { title: "Học Node.js" }
    const userId = req.user.id;      // "673abc123" (từ JWT)

    // Gọi Service
    const result = await TodoService.createTodo(data, userId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
```

**Controller làm gì?**
- ✅ Extract `req.body` và `req.user.id`
- ✅ Pass data cho Service
- ✅ Return response với status 201
- ✅ Pass error to error handler nếu có lỗi

**Controller KHÔNG làm gì?**
- ❌ Không validate (để Service làm)
- ❌ Không gọi database (để Repository làm)

---

#### **Bước 3: Service**
```javascript
// services/TodoService.js
async createTodo(data, userId) {
  // VALIDATION
  if (!data.title || data.title.trim() === '') {
    const error = new Error('Vui lòng nhập nội dung todo');
    error.statusCode = 400;
    throw error;
  }

  // BUSINESS LOGIC: Transform data
  const todoData = {
    title: data.title.trim(),  // Clean whitespace
    user: userId,
    completed: false           // Default value
  };

  // CALL REPOSITORY
  const todo = await TodoRepository.create(todoData);

  // RETURN FORMATTED RESPONSE
  return {
    success: true,
    data: todo
  };
}
```

**Service làm gì?**
- ✅ **Validate**: Check title không rỗng
- ✅ **Transform**: Trim whitespace
- ✅ **Business rules**: Set completed = false
- ✅ **Call Repository**: Tạo todo trong DB
- ✅ **Format response**: Wrap trong { success, data }

---

#### **Bước 4: Repository**
```javascript
// repositories/TodoRepository.js
async create(todoData) {
  return await Todo.create(todoData);
}
```

**Repository làm gì?**
- ✅ Call Mongoose Model để create document
- ✅ Return raw data từ DB

**Repository KHÔNG làm gì?**
- ❌ Không validate (Service đã làm)
- ❌ Không transform data
- ❌ CHỈ database operations

---

#### **Bước 5: Model**
```javascript
// models/Todo.js
const todoSchema = new Schema({
  title: { type: String, required: true, maxlength: 200 },
  completed: { type: Boolean, default: false },
  user: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true });
```

**Model làm gì?**
- ✅ Schema validation (maxlength, required)
- ✅ Auto-add timestamps (createdAt, updatedAt)
- ✅ Save to MongoDB

---

#### **Bước 6: MongoDB**
Document được lưu:
```json
{
  "_id": "673def456",
  "title": "Học Node.js",
  "completed": false,
  "user": "673abc123",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### Response:
```json
{
  "success": true,
  "data": {
    "_id": "673def456",
    "title": "Học Node.js",
    "completed": false,
    "user": "673abc123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🎯 TẠI SAO DÙNG ARCHITECTURE NÀY?

### ✅ **Separation of Concerns**
Mỗi layer có 1 trách nhiệm duy nhất:
- Controller: HTTP handling
- Service: Business logic
- Repository: Database operations
- Model: Data structure

### ✅ **Easy to Test**
```javascript
// Test Service mà không cần database
test('createTodo validates title', async () => {
  await expect(TodoService.createTodo({}, userId))
    .rejects.toThrow('Vui lòng nhập nội dung todo');
});
```

### ✅ **Reusable**
Service có thể được dùng từ nhiều controllers:
```javascript
// API Controller
await TodoService.createTodo(data, userId);

// CLI Script
await TodoService.createTodo(data, userId);

// Background Job
await TodoService.createTodo(data, userId);
```

### ✅ **Easy to Change**
Đổi database từ MongoDB → PostgreSQL?
→ CHỈ cần sửa Repository!

---

## 📝 SO SÁNH VỚI CÁCH CŨ

### ❌ **Cách cũ**: Tất cả logic trong route handler
```javascript
router.post('/todos', async (req, res) => {
  // Validation
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title required' });
  }

  // Database operation
  const todo = await Todo.create({
    title: req.body.title.trim(),
    user: req.user.id
  });

  // Response
  res.json({ data: todo });
});
```

**Vấn đề**:
- ❌ Khó test (phải mock req, res, database)
- ❌ Không reusable
- ❌ Khó maintain khi logic phức tạp
- ❌ Trộn lẫn concerns

---

### ✅ **Cách mới**: Tách layers
```javascript
// Route
router.post('/', controller.create);

// Controller
controller.create = (req, res) => {
  const result = await service.create(req.body, req.user.id);
  res.json(result);
};

// Service
service.create = (data, userId) => {
  // Validation + Business logic
  return repository.create(cleanData);
};

// Repository
repository.create = (data) => {
  return Model.create(data);
};
```

**Lợi ích**:
- ✅ Dễ test từng layer
- ✅ Code rõ ràng, dễ đọc
- ✅ Reusable
- ✅ Dễ maintain và scale

---

## 🚀 CÁC ENDPOINTS KHÁC

Xem các file để hiểu flow:
- **GET /api/todos** → TodoController.getAllTodos → TodoService.getUserTodos → TodoRepository.findByUserId
- **PUT /api/todos/:id** → TodoController.updateTodo → TodoService.updateTodo (+ auth check) → TodoRepository.update
- **DELETE /api/todos/:id** → TodoController.deleteTodo → TodoService.deleteTodo (+ auth check) → TodoRepository.delete

---

**Hiểu rồi thì bắt đầu code thôi!** 🎉
