# Full-stack Todo App - Hướng dẫn học từng bước

## 📚 Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Phase 1: Setup & First Server](#phase-1-setup--first-server)
3. [Phase 2: Database Connection](#phase-2-database-connection)
4. [Phase 3: Models & Schemas](#phase-3-models--schemas)
5. [Phase 4: CRUD API Routes](#phase-4-crud-api-routes)
6. [Phase 5: Authentication](#phase-5-authentication)
7. [Phase 6: Middleware & Error Handling](#phase-6-middleware--error-handling)
8. [Phase 7: Frontend Setup](#phase-7-frontend-setup)
9. [Phase 8: React Components](#phase-8-react-components)
10. [Phase 9: API Integration](#phase-9-api-integration)
11. [Phase 10: Full Integration & Testing](#phase-10-full-integration--testing)

---

## 1. Tổng quan kiến trúc

### 1.1 Kiến trúc Client-Server

```
┌─────────────────┐         HTTP Requests          ┌─────────────────┐
│                 │    (JSON data + JWT token)     │                 │
│   FRONTEND      │ ──────────────────────────────>│    BACKEND      │
│   (React)       │                                 │   (Node.js)     │
│   Port 3000     │ <──────────────────────────────│   Port 5000     │
│                 │         HTTP Responses          │                 │
└─────────────────┘         (JSON data)             └─────────────────┘
                                                            │
                                                            │ Mongoose
                                                            ↓
                                                    ┌─────────────────┐
                                                    │    MongoDB      │
                                                    │   (Database)    │
                                                    └─────────────────┘
```

### 1.2 Tech Stack

**Backend:**
- **Node.js**: JavaScript runtime để chạy code JavaScript ở server
- **Express**: Framework để tạo web server và API endpoints
- **MongoDB**: NoSQL database để lưu trữ dữ liệu
- **Mongoose**: ODM (Object Data Modeling) library để làm việc với MongoDB
- **JWT**: JSON Web Token để authentication
- **bcryptjs**: Library để hash password

**Frontend:**
- **React**: Library để xây dựng UI
- **Context API**: State management cho authentication
- **Fetch API**: Gọi API từ backend

### 1.3 Request-Response Flow

```
User action (VD: Tạo todo)
    ↓
React Component (TodoForm)
    ↓
Call API function (api.createTodo)
    ↓
HTTP POST request với JWT token
    ↓
Express Server nhận request
    ↓
CORS middleware (kiểm tra origin)
    ↓
express.json() (parse JSON body)
    ↓
Auth middleware (verify JWT token)
    ↓
Route handler (/api/todos POST)
    ↓
Mongoose Model (Todo.create)
    ↓
MongoDB (lưu document)
    ↓
Response trả về (JSON)
    ↓
React update state
    ↓
UI re-render với data mới
```

---

## Phase 1: Setup & First Server

### 🎯 Mục tiêu
Tạo Express server đơn giản và hiểu cách server hoạt động

### 📖 Kiến thức cần hiểu

#### 1.1 Node.js là gì?
- **Node.js** là môi trường chạy JavaScript ngoài browser
- Trước có Node.js: JavaScript chỉ chạy trong browser
- Sau khi có Node.js: JavaScript chạy được ở server

#### 1.2 Express là gì?
- **Express** là framework (bộ công cụ) để xây dựng web server
- Giúp tạo API endpoints dễ dàng
- Xử lý HTTP requests và responses

#### 1.3 NPM (Node Package Manager)
- **NPM** là công cụ quản lý thư viện (packages) cho Node.js
- `package.json`: File chứa thông tin project và danh sách dependencies
- `npm install`: Cài đặt tất cả dependencies trong package.json

### 📁 Files liên quan
- `backend/package.json`
- `backend/server.js`
- `backend/.env.example`

### 💻 Code Explanation

#### package.json
```json
{
  "dependencies": {
    "express": "^4.18.2",  // Framework web server
    "mongoose": "^7.6.3",  // ODM cho MongoDB
    "dotenv": "^16.3.1",   // Đọc file .env
    "bcryptjs": "^2.4.3",  // Hash password
    "jsonwebtoken": "^9.0.2", // Tạo JWT token
    "cors": "^2.8.5"       // Cho phép cross-origin requests
  }
}
```

**Giải thích version numbers (VD: ^4.18.2):**
- `4`: Major version (breaking changes)
- `18`: Minor version (new features)
- `2`: Patch version (bug fixes)
- `^`: Cho phép update minor và patch, không update major

#### server.js - Cấu trúc cơ bản

```javascript
const express = require('express'); // Import Express
const app = express(); // Tạo Express app

// Middleware để parse JSON
app.use(express.json());

// Route đơn giản
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server chạy tại port ${PORT}`);
});
```

**Giải thích từng phần:**

1. **require()**: Import module/library
   ```javascript
   const express = require('express');
   // Tương đương: import express from 'express' (ES6)
   ```

2. **app.use()**: Thêm middleware
   - Middleware là function chạy trước route handler
   - Có thể sửa đổi req/res hoặc kiểm tra điều kiện

3. **app.get()**: Định nghĩa route cho HTTP GET request
   - Tham số 1: Path (URL)
   - Tham số 2: Handler function (req, res) => {}

4. **req (Request)**: Object chứa thông tin request từ client
   - `req.body`: Dữ liệu trong request body
   - `req.params`: URL parameters
   - `req.query`: Query string parameters
   - `req.headers`: HTTP headers

5. **res (Response)**: Object để gửi response về client
   - `res.json()`: Gửi JSON response
   - `res.status()`: Set status code
   - `res.send()`: Gửi response (string/HTML)

6. **app.listen()**: Khởi động server và lắng nghe requests

### 🔄 Flow Diagram

```
Client gửi request
    ↓
GET http://localhost:5000/api/health
    ↓
Express server nhận request
    ↓
Tìm route phù hợp: app.get('/api/health', ...)
    ↓
Chạy handler function
    ↓
res.json({ status: 'OK' })
    ↓
Response được gửi về client
    ↓
Client nhận: { "status": "OK" }
```

### 🔑 Khái niệm mới

- **Server**: Chương trình chạy 24/7 để phục vụ requests
- **Port**: Cổng để server lắng nghe (VD: 5000, 3000)
- **HTTP Methods**: GET, POST, PUT, DELETE
  - **GET**: Lấy dữ liệu
  - **POST**: Tạo mới
  - **PUT**: Cập nhật
  - **DELETE**: Xóa
- **Endpoint**: URL path kết hợp với HTTP method (VD: GET /api/todos)
- **JSON**: Format dữ liệu (JavaScript Object Notation)

### ⚠️ Điểm cần chú ý

1. **Port đã được sử dụng**: Nếu port 5000 đã có app khác dùng → đổi sang port khác
2. **Async/await**: Hầu hết operations với DB là async
3. **Error handling**: Luôn dùng try-catch cho async code

### 🎯 Thực hành

**Bài 1**: Tạo route mới `/api/hello` trả về `{ message: "Hello World" }`
```javascript
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello World" });
});
```

**Bài 2**: Tạo route nhận tên từ URL parameter
```javascript
app.get('/api/hello/:name', (req, res) => {
  const name = req.params.name;
  res.json({ message: `Hello ${name}` });
});
// Test: GET /api/hello/John → { "message": "Hello John" }
```

**Bài 3**: Thay đổi port sang 8000 và kiểm tra server vẫn chạy

---

## Phase 2: Database Connection

### 🎯 Mục tiêu
Kết nối Express server với MongoDB database

### 📖 Kiến thức cần hiểu

#### 2.1 Database là gì?
- **Database**: Nơi lưu trữ dữ liệu lâu dài
- Khi server tắt, data trong RAM sẽ mất
- Database giúp lưu data vĩnh viễn

#### 2.2 MongoDB
- **MongoDB** là NoSQL database (không dùng SQL)
- Lưu data dạng **documents** (giống JSON objects)
- **Collection**: Nhóm các documents giống nhau (giống table trong SQL)
- **Document**: 1 record (giống row trong SQL)

**Ví dụ document trong MongoDB:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Học Node.js",
  "completed": false,
  "user": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### 2.3 Mongoose
- **Mongoose** là ODM (Object Data Modeling) library
- Cung cấp:
  - Schema: Định nghĩa cấu trúc document
  - Model: Class để tương tác với collection
  - Validation: Kiểm tra dữ liệu
  - Middleware: Hooks trước/sau operations

### 📁 Files liên quan
- `backend/config/db.js`
- `backend/.env.example`

### 💻 Code Explanation

#### .env file (Environment Variables)
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
JWT_SECRET=your_secret_key_here
```

**Tại sao dùng .env?**
- Tách configuration khỏi code
- Bảo mật: Không commit sensitive info vào Git
- Dễ thay đổi config giữa environments (dev/production)

**Đọc .env với dotenv:**
```javascript
require('dotenv').config();
const port = process.env.PORT; // Lấy PORT từ .env
```

#### db.js - Connection Logic

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Kết nối tới MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Thoát chương trình với error code
  }
};

module.exports = connectDB;
```

**Giải thích chi tiết:**

1. **async/await**:
   ```javascript
   // Cách cũ (callback):
   mongoose.connect(uri, (err, conn) => {
     if (err) console.error(err);
   });

   // Cách mới (async/await):
   const conn = await mongoose.connect(uri);
   ```
   - `async`: Đánh dấu function là asynchronous
   - `await`: Đợi promise resolve trước khi tiếp tục
   - Dễ đọc hơn callback hell

2. **try-catch**: Bắt lỗi trong async code
   ```javascript
   try {
     // Code có thể bị lỗi
     await riskyOperation();
   } catch (error) {
     // Xử lý lỗi
     console.error(error);
   }
   ```

3. **process.exit(1)**:
   - `process`: Global object trong Node.js
   - `exit(1)`: Thoát chương trình
   - Exit code 1 = có lỗi
   - Exit code 0 = thành công

4. **module.exports**: Export để dùng ở file khác
   ```javascript
   // db.js
   module.exports = connectDB;

   // server.js
   const connectDB = require('./config/db');
   connectDB(); // Gọi function
   ```

### 🔄 Flow Diagram

```
Server khởi động
    ↓
require('dotenv').config()
    ↓
Đọc MONGODB_URI từ .env
    ↓
connectDB() được gọi
    ↓
mongoose.connect(MONGODB_URI)
    ↓
Đợi connection
    ↓
┌──────────┴──────────┐
│                     │
Success               Failure
│                     │
Console log           Console error
"MongoDB Connected"   process.exit(1)
│                     │
Server tiếp tục       Server dừng
```

### 🔑 Khái niệm mới

- **Connection String**: URL để kết nối database
  ```
  mongodb://localhost:27017/todoapp
  └──┬───┘ └────┬────┘ └─┬─┘ └──┬───┘
  Protocol    Host    Port   DB Name
  ```
- **Promise**: Object đại diện cho giá trị sẽ có trong tương lai
- **Async operation**: Tác vụ mất thời gian (network, file I/O, DB)
- **Environment variables**: Biến cấu hình từ môi trường

### ⚠️ Điểm cần chú ý

1. **Connection string**:
   - Local: `mongodb://localhost:27017/dbname`
   - Atlas (cloud): `mongodb+srv://username:password@cluster.mongodb.net/dbname`

2. **Async code**: Nhớ dùng `await` khi gọi async function
   ```javascript
   // ❌ Sai - không đợi
   connectDB();

   // ✅ Đúng - đợi connection
   await connectDB();
   ```

3. **Error handling**: Luôn có try-catch cho database operations

4. **Security**: Không commit `.env` file vào Git
   - Thêm `.env` vào `.gitignore`
   - Commit `.env.example` để người khác biết cần gì

### 🎯 Thực hành

**Bài 1**: Setup MongoDB local
```bash
# Cài MongoDB
# Windows: Download MongoDB Community Server

# Chạy MongoDB
mongod

# Hoặc dùng MongoDB Atlas (cloud - FREE)
# Tạo account tại: https://www.mongodb.com/cloud/atlas
```

**Bài 2**: Test connection
Thêm vào `server.js`:
```javascript
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err);
});
```

**Bài 3**: Tạo function để disconnect
```javascript
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(error);
  }
};
```

---

## Phase 3: Models & Schemas

### 🎯 Mục tiêu
Định nghĩa cấu trúc dữ liệu với Mongoose Schemas và Models

### 📖 Kiến thức cần hiểu

#### 3.1 Schema vs Model

**Schema**: Bản thiết kế của document
```javascript
const userSchema = new Schema({
  name: String,
  email: String
});
```

**Model**: Class để tương tác với collection
```javascript
const User = mongoose.model('User', userSchema);

// Tạo user mới
const user = await User.create({ name: 'John', email: 'john@example.com' });

// Query users
const users = await User.find();
```

**Analogy**:
- Schema = Bản vẽ nhà
- Model = Công ty xây dựng nhà
- Document = Ngôi nhà thực tế

#### 3.2 Schema Types

```javascript
{
  stringField: String,
  numberField: Number,
  booleanField: Boolean,
  dateField: Date,
  arrayField: [String], // Array of strings
  objectIdField: mongoose.Schema.Types.ObjectId, // Reference to another document
  mixedField: mongoose.Schema.Types.Mixed // Any type
}
```

#### 3.3 Schema Options

```javascript
{
  type: String,        // Kiểu dữ liệu
  required: true,      // Bắt buộc
  unique: true,        // Không trùng lặp
  default: 'value',    // Giá trị mặc định
  trim: true,          // Xóa khoảng trắng đầu/cuối
  lowercase: true,     // Chuyển thành chữ thường
  uppercase: true,     // Chuyển thành chữ hoa
  minlength: 6,        // Độ dài tối thiểu
  maxlength: 100,      // Độ dài tối đa
  min: 0,              // Giá trị nhỏ nhất (number)
  max: 100,            // Giá trị lớn nhất (number)
  match: /regex/,      // Regex validation
  enum: ['a', 'b'],    // Chỉ cho phép các giá trị này
  select: false        // Không trả về field này khi query
}
```

### 📁 Files liên quan
- `backend/models/User.js`
- `backend/models/Todo.js`

### 💻 Code Explanation

#### User Model

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true, // Tạo index để đảm bảo không trùng
      lowercase: true,
      match: [/^\w+@\w+\.\w+$/, 'Email không hợp lệ']
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: 6,
      select: false // Không trả về password khi query
    }
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
);
```

**Timestamps option:**
```javascript
{ timestamps: true }
// Tự động thêm:
// - createdAt: Date document được tạo
// - updatedAt: Date document được update lần cuối
```

#### Pre-save Hook (Middleware)

```javascript
userSchema.pre('save', async function(next) {
  // 'this' = document đang được save

  // Chỉ hash nếu password mới hoặc được sửa
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Tiếp tục save
});
```

**Giải thích hook:**
- **pre('save')**: Chạy TRƯỚC khi save
- **post('save')**: Chạy SAU khi save
- **this**: Document instance
- **next()**: Gọi để tiếp tục pipeline

**Tại sao không dùng arrow function?**
```javascript
// ❌ Sai - arrow function không có 'this' riêng
userSchema.pre('save', async (next) => {
  console.log(this); // undefined hoặc global object
});

// ✅ Đúng - function có 'this'
userSchema.pre('save', async function(next) {
  console.log(this); // document instance
});
```

#### Instance Methods

```javascript
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sử dụng:
const user = await User.findOne({ email });
const isMatch = await user.matchPassword('password123');
```

**Instance method** = method gọi trên 1 document cụ thể

#### Static Methods

```javascript
todoSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Sử dụng:
const todos = await Todo.findByUser(userId);
```

**Static method** = method gọi trên Model (không phải instance)

**Khác biệt:**
```javascript
// Instance method - gọi trên document
const user = await User.findById(id);
user.someMethod(); // 'this' = user document

// Static method - gọi trên Model
User.someMethod(); // 'this' = User model
```

#### Todo Model với Reference

```javascript
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  }
}, {
  timestamps: true
});
```

**ObjectId Reference:**
- Tạo relationship giữa collections
- Giống foreign key trong SQL
- Cho phép populate (join) data

**Populate example:**
```javascript
// Không populate - chỉ có ObjectId
const todo = await Todo.findById(id);
console.log(todo.user); // "507f191e810c19729de860ea"

// Có populate - có full user object
const todo = await Todo.findById(id).populate('user');
console.log(todo.user); // { _id: "507f...", name: "John", email: "john@example.com" }

// Populate specific fields
const todo = await Todo.findById(id).populate('user', 'name email');
```

### 🔄 Flow Diagram: Tạo User

```
User.create({ name, email, password })
    ↓
Mongoose tạo document instance
    ↓
Trigger pre('save') hook
    ↓
Kiểm tra password có modified không?
    ↓
    Yes → Hash password
    ↓
    No → Bỏ qua
    ↓
Validation (required, unique, minlength, etc.)
    ↓
Lỗi? → Throw ValidationError
    ↓
Không lỗi → Save vào MongoDB
    ↓
MongoDB trả về saved document
    ↓
Trigger post('save') hook (nếu có)
    ↓
Return document
```

### 🔑 Khái niệm mới

- **ODM (Object Data Modeling)**: Map objects trong code với documents trong DB
- **Schema**: Định nghĩa cấu trúc và validation rules
- **Model**: Class để CRUD operations
- **Document**: Instance của Model (1 record trong DB)
- **Hook/Middleware**: Function chạy tự động ở các thời điểm nhất định
- **Instance method**: Method gọi trên document
- **Static method**: Method gọi trên Model
- **Virtual**: Field tính toán, không lưu trong DB
- **Index**: Tối ưu query performance
- **Populate**: Join data từ collection khác

### ⚠️ Điểm cần chú ý

1. **Model name convention**:
   ```javascript
   // Model name: Singular, PascalCase
   const User = mongoose.model('User', userSchema);
   // Collection name tự động: lowercase, plural → 'users'

   const Todo = mongoose.model('Todo', todoSchema);
   // Collection → 'todos'
   ```

2. **_id field**: MongoDB tự động tạo
   ```javascript
   {
     _id: ObjectId("507f1f77bcf86cd799439011"), // Auto-generated
     title: "Học Node.js"
   }
   ```

3. **Validation chỉ chạy khi save/create**:
   ```javascript
   // ✅ Chạy validation
   await User.create({ email: 'invalid' });

   // ❌ KHÔNG chạy validation
   await User.updateOne({ _id: id }, { email: 'invalid' });

   // ✅ Chạy validation với update
   await User.findByIdAndUpdate(id, data, { runValidators: true });
   ```

4. **select: false** cần thêm `+` để lấy:
   ```javascript
   // Password không được trả về
   const user = await User.findOne({ email });
   console.log(user.password); // undefined

   // Thêm + để lấy password
   const user = await User.findOne({ email }).select('+password');
   console.log(user.password); // hashed password
   ```

### 🎯 Thực hành

**Bài 1**: Thêm field `age` vào User model
```javascript
age: {
  type: Number,
  min: [0, 'Tuổi không thể âm'],
  max: [120, 'Tuổi không hợp lệ']
}
```

**Bài 2**: Tạo instance method `getFullName`
```javascript
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};
```

**Bài 3**: Tạo virtual field `todoCount`
```javascript
todoSchema.virtual('todoCount').get(function() {
  return this.todos.length;
});
```

**Bài 4**: Thêm index cho field thường query
```javascript
todoSchema.index({ user: 1, createdAt: -1 });
// Composite index: Query theo user và sort theo createdAt
```

---

## Phase 4: CRUD API Routes

### 🎯 Mục tiêu
Tạo REST API endpoints để thực hiện CRUD operations

### 📖 Kiến thức cần hiểu

#### 4.1 REST API

**REST** (Representational State Transfer) là chuẩn thiết kế API

**Principles:**
- Mỗi resource có URL riêng (VD: `/api/todos`)
- Dùng HTTP methods để thể hiện action
- Stateless: Mỗi request độc lập

**CRUD Operations:**
| Operation | HTTP Method | Endpoint | Body | Response |
|-----------|-------------|----------|------|----------|
| Create | POST | /api/todos | { title } | Created todo |
| Read All | GET | /api/todos | - | Array of todos |
| Read One | GET | /api/todos/:id | - | Single todo |
| Update | PUT | /api/todos/:id | { title, completed } | Updated todo |
| Delete | DELETE | /api/todos/:id | - | Success message |

#### 4.2 Express Router

```javascript
const express = require('express');
const router = express.Router();

// Define routes
router.get('/', getAllTodos);
router.post('/', createTodo);

// Export router
module.exports = router;

// Use in server.js
app.use('/api/todos', todoRouter);
```

**Tại sao dùng Router?**
- Tổ chức code tốt hơn (tách routes ra file riêng)
- Dễ maintain
- Có thể apply middleware cho nhóm routes

#### 4.3 URL Parameters

```javascript
// Route definition
router.get('/todos/:id', handler);

// Request
GET /api/todos/123

// Trong handler
req.params.id // "123"
```

**Nhiều parameters:**
```javascript
router.get('/users/:userId/todos/:todoId', handler);
// GET /api/users/abc/todos/xyz
// req.params.userId = "abc"
// req.params.todoId = "xyz"
```

#### 4.4 Request Body

```javascript
// Client gửi
POST /api/todos
Content-Type: application/json
{
  "title": "Học Node.js"
}

// Server nhận
router.post('/todos', (req, res) => {
  console.log(req.body.title); // "Học Node.js"
});
```

**Cần middleware để parse:**
```javascript
app.use(express.json()); // Parse JSON body
```

### 📁 Files liên quan
- `backend/routes/todos.js`
- `backend/routes/auth.js`

### 💻 Code Explanation

#### GET All Todos

```javascript
router.get('/', async (req, res, next) => {
  try {
    // Query todos của user hiện tại
    const todos = await Todo.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // Mới nhất trước

    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error); // Pass error to error handler
  }
});
```

**Giải thích:**
- `Todo.find({ user: req.user.id })`: Tìm todos của user
- `sort({ createdAt: -1 })`: Sắp xếp giảm dần (-1) theo createdAt
- `req.user`: Set bởi auth middleware
- `next(error)`: Forward error to error handler middleware

#### GET One Todo

```javascript
router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    // Check exists
    if (!todo) {
      res.status(404);
      throw new Error('Todo không tồn tại');
    }

    // Authorization: Kiểm tra todo có phải của user không
    if (todo.user.toString() !== req.user.id) {
      res.status(403); // Forbidden
      throw new Error('Không có quyền truy cập');
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});
```

**Giải thích Authorization:**
```javascript
// todo.user là ObjectId
// req.user.id là string
// Phải convert về cùng type để so sánh

todo.user.toString() === req.user.id
// hoặc
todo.user.equals(req.user.id)
```

#### POST Create Todo

```javascript
router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title) {
      res.status(400);
      throw new Error('Vui lòng nhập title');
    }

    // Create todo
    const todo = await Todo.create({
      title,
      user: req.user.id, // Gắn với user hiện tại
      completed: false
    });

    res.status(201).json({ // 201 = Created
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
});
```

**Status codes:**
- 200: OK (success)
- 201: Created (resource created)
- 400: Bad Request (validation error)
- 401: Unauthorized (not logged in)
- 403: Forbidden (không có quyền)
- 404: Not Found
- 500: Internal Server Error

#### PUT Update Todo

```javascript
router.put('/:id', async (req, res, next) => {
  try {
    // Tìm todo
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo không tồn tại');
    }

    // Authorization check
    if (todo.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Không có quyền sửa');
    }

    // Update
    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body, // { title, completed }
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});
```

**findByIdAndUpdate options:**
- `new: true`: Return document sau update (mặc định: trước update)
- `runValidators: true`: Chạy schema validation
- `upsert: true`: Tạo mới nếu không tìm thấy

#### DELETE Todo

```javascript
router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo không tồn tại');
    }

    if (todo.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Không có quyền xóa');
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Todo đã được xóa',
      data: {}
    });
  } catch (error) {
    next(error);
  }
});
```

### 🔄 Flow Diagram: Create Todo

```
Client
    ↓
POST /api/todos
Body: { title: "Học Node.js" }
Header: Authorization: Bearer <token>
    ↓
Express Server
    ↓
CORS middleware (check origin)
    ↓
express.json() (parse body)
    ↓
Auth middleware (verify token, set req.user)
    ↓
Route: POST /api/todos
    ↓
Validate: title có rỗng không?
    ↓
Todo.create({ title, user: req.user.id })
    ↓
Mongoose validation
    ↓
Save to MongoDB
    ↓
Return created todo
    ↓
res.status(201).json({ success: true, data: todo })
    ↓
Client nhận response
```

### 🔑 Khái niệm mới

- **REST**: Chuẩn thiết kế API
- **CRUD**: Create, Read, Update, Delete
- **Router**: Object để group routes
- **URL Parameter**: Dynamic part trong URL (:id)
- **Request Body**: Dữ liệu gửi kèm request
- **Status Code**: Mã số thể hiện kết quả request
- **Authorization**: Kiểm tra quyền truy cập resource

### ⚠️ Điểm cần chú ý

1. **Luôn validate input:**
   ```javascript
   if (!title || title.trim() === '') {
     res.status(400);
     throw new Error('Title không hợp lệ');
   }
   ```

2. **Authorization vs Authentication:**
   - **Authentication**: Xác định user là ai (login)
   - **Authorization**: Kiểm tra user có quyền không

3. **async/await với try-catch:**
   ```javascript
   // ✅ Đúng
   try {
     await Todo.create(data);
   } catch (error) {
     next(error);
   }

   // ❌ Sai - không bắt lỗi
   await Todo.create(data);
   ```

4. **res.status() trước throw Error:**
   ```javascript
   res.status(404);
   throw new Error('Not found');
   // Error handler sẽ dùng status 404
   ```

5. **Không gửi response 2 lần:**
   ```javascript
   // ❌ Sai
   res.json({ data: todo });
   res.json({ data: todo }); // Error: Cannot set headers after sent

   // ✅ Đúng
   if (condition) {
     return res.json({ data: todo }); // Return để dừng
   }
   res.json({ other: data });
   ```

### 🎯 Thực hành

**Bài 1**: Tạo endpoint PATCH `/todos/:id/toggle` để toggle completed
```javascript
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    // ... authorization check
    todo.completed = !todo.completed;
    await todo.save();
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});
```

**Bài 2**: Tạo endpoint GET `/todos/stats` để lấy thống kê
```javascript
router.get('/stats', async (req, res, next) => {
  try {
    const total = await Todo.countDocuments({ user: req.user.id });
    const completed = await Todo.countDocuments({
      user: req.user.id,
      completed: true
    });

    res.json({
      success: true,
      data: {
        total,
        completed,
        active: total - completed
      }
    });
  } catch (error) {
    next(error);
  }
});
```

**Bài 3**: Thêm pagination cho GET `/todos`
```javascript
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find({ user: req.user.id })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Todo.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: todos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});
```

---

## Phase 5: Authentication

### 🎯 Mục tiêu
Implement đăng ký, đăng nhập với JWT authentication

### 📖 Kiến thức cần hiểu

#### 5.1 Authentication Flow

```
1. User đăng ký
   ↓
2. Server hash password và lưu vào DB
   ↓
3. User đăng nhập
   ↓
4. Server verify password
   ↓
5. Server tạo JWT token
   ↓
6. Client lưu token (localStorage)
   ↓
7. Client gửi token trong header cho mọi request
   ↓
8. Server verify token và xác định user
```

#### 5.2 Password Hashing

**Tại sao hash password?**
- Không lưu plain text password (bảo mật)
- Nếu DB bị hack, hacker không lấy được password gốc
- Không thể reverse hash → password

**bcrypt:**
```javascript
const bcrypt = require('bcryptjs');

// Hash password
const salt = await bcrypt.genSalt(10); // Generate salt
const hashedPassword = await bcrypt.hash('password123', salt);
// Result: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

// Compare password
const isMatch = await bcrypt.compare('password123', hashedPassword);
// true
```

**Salt là gì?**
- Chuỗi random thêm vào password trước khi hash
- Ngăn rainbow table attacks
- Mỗi password có salt khác nhau

#### 5.3 JWT (JSON Web Token)

**Cấu trúc JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2FiYyIsImlhdCI6MTYzMjE1MDQwMH0.abc123def456
└────────────┬────────────────────┘ └──────────────┬─────────────────────┘ └──────┬─────┘
         Header                              Payload                           Signature
```

**Header**: Metadata (algorithm, type)
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**: Data (không mã hóa, chỉ encode base64)
```json
{
  "id": "673abc123",
  "iat": 1632150400, // Issued at
  "exp": 1634742400  // Expiration
}
```

**Signature**: Verify token không bị sửa đổi
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

**JWT Flow:**
```
Login thành công
    ↓
Server tạo token
jwt.sign({ id: user._id }, SECRET, { expiresIn: '30d' })
    ↓
Client lưu token
localStorage.setItem('token', token)
    ↓
Client gửi token trong mỗi request
Authorization: Bearer <token>
    ↓
Server verify token
jwt.verify(token, SECRET)
    ↓
Nếu hợp lệ → lấy user ID từ payload
    ↓
Attach user vào req.user
    ↓
Route handler có thể dùng req.user
```

### 📁 Files liên quan
- `backend/routes/auth.js`
- `backend/models/User.js`

### 💻 Code Explanation

#### Register Endpoint

```javascript
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Vui lòng điền đầy đủ thông tin');
    }

    // 2. Check email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Email đã được sử dụng');
    }

    // 3. Create user (password tự động hash trong pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Return user + token
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});
```

**Generate Token Function:**
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },                        // Payload - chỉ lưu user ID
    process.env.JWT_SECRET,        // Secret key
    { expiresIn: '30d' }           // Options - hết hạn sau 30 ngày
  );
};
```

**Giải thích:**
- `jwt.sign()`: Tạo token
- Payload chỉ nên chứa thông tin cần thiết (user ID)
- KHÔNG lưu password hoặc sensitive data trong payload
- Payload KHÔNG được mã hóa, chỉ encode base64

#### Login Endpoint

```javascript
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      res.status(400);
      throw new Error('Vui lòng nhập email và mật khẩu');
    }

    // 2. Find user + include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // 3. Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      res.status(401);
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Return user + token
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});
```

**matchPassword Method (trong User model):**
```javascript
userSchema.methods.matchPassword = async function(enteredPassword) {
  // So sánh plain password với hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};
```

#### Get Current User

```javascript
router.get('/me', async (req, res, next) => {
  try {
    // Extract token
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Không có quyền truy cập');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User không tồn tại');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});
```

### 🔄 Flow Diagram: Complete Auth Flow

```
=== REGISTER ===
Client: POST /api/auth/register
Body: { name, email, password }
    ↓
Server: Validate input
    ↓
Check email exists? → Có → Return 400 error
    ↓ Không
User.create() → Trigger pre-save hook → Hash password
    ↓
Save to MongoDB
    ↓
Generate JWT token: jwt.sign({ id: user._id }, SECRET)
    ↓
Return: { _id, name, email, token }
    ↓
Client: Lưu token vào localStorage

=== LOGIN ===
Client: POST /api/auth/login
Body: { email, password }
    ↓
Server: Find user by email
    ↓
User exists? → Không → Return 401 error
    ↓ Có
bcrypt.compare(password, user.password)
    ↓
Match? → Không → Return 401 error
    ↓ Có
Generate JWT token
    ↓
Return: { _id, name, email, token }
    ↓
Client: Lưu token

=== PROTECTED REQUEST ===
Client: GET /api/todos
Header: Authorization: Bearer <token>
    ↓
Server: Extract token from header
    ↓
jwt.verify(token, SECRET)
    ↓
Valid? → Không → Return 401 error
    ↓ Có
Find user by ID từ token payload
    ↓
Set req.user = user
    ↓
Continue to route handler
    ↓
Route handler dùng req.user.id
```

### 🔑 Khái niệm mới

- **Authentication**: Xác định user là ai
- **Hashing**: Biến đổi data thành fixed-size string (không thể reverse)
- **Salt**: Random data để tăng security cho hash
- **JWT**: Standard cho token-based authentication
- **Bearer token**: Token gửi trong Authorization header
- **Payload**: Data chứa trong JWT
- **Token expiration**: Thời gian token hết hạn

### ⚠️ Điểm cần chú ý

1. **Không lưu password trong response:**
   ```javascript
   // ❌ Sai
   res.json({ user }); // Có thể expose password

   // ✅ Đúng
   res.json({
     _id: user._id,
     name: user.name,
     email: user.email,
     token
   });
   ```

2. **JWT_SECRET phải bảo mật:**
   - Dùng string random phức tạp
   - KHÔNG commit vào Git
   - Lưu trong .env

3. **Error messages không nên quá cụ thể:**
   ```javascript
   // ❌ Cho hacker biết email có tồn tại không
   if (!user) {
     throw new Error('Email không tồn tại');
   }

   // ✅ Mơ hồ hơn
   if (!user || !isPasswordMatch) {
     throw new Error('Email hoặc mật khẩu không đúng');
   }
   ```

4. **Token expiration:**
   - Short-lived (1h, 1d) cho production
   - Long-lived (30d) cho development
   - Implement refresh token cho production app

5. **select('+password'):**
   ```javascript
   // password có select: false trong schema
   const user = await User.findOne({ email });
   console.log(user.password); // undefined

   // Phải thêm + để lấy
   const user = await User.findOne({ email }).select('+password');
   console.log(user.password); // hashed password
   ```

### 🎯 Thực hành

**Bài 1**: Tạo endpoint change password
```javascript
router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Mật khẩu hiện tại không đúng');
    }

    // Update password
    user.password = newPassword;
    await user.save(); // Trigger pre-save hook để hash

    res.json({ success: true, message: 'Đã đổi mật khẩu' });
  } catch (error) {
    next(error);
  }
});
```

**Bài 2**: Thêm field `role` vào User
```javascript
// User model
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}

// JWT payload
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, SECRET, { expiresIn: '30d' });
};

// Middleware check admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Chỉ admin mới có quyền');
  }
  next();
};
```

**Bài 3**: Implement logout (blacklist token)
```javascript
// Trong production, cần lưu blacklisted tokens vào DB hoặc Redis
// Đơn giản: Client xóa token là đủ
router.post('/logout', (req, res) => {
  // Client sẽ xóa token từ localStorage
  res.json({ success: true, message: 'Đã đăng xuất' });
});
```

---

## Phase 6: Middleware & Error Handling

### 🎯 Mục tiêu
Hiểu middleware pattern và implement centralized error handling

### 📖 Kiến thức cần hiểu

#### 6.1 Middleware là gì?

**Definition**: Function chạy trong request-response cycle

```javascript
const middleware = (req, res, next) => {
  // Do something
  console.log('Middleware chạy');

  // Gọi next() để chuyển sang middleware/route tiếp theo
  next();
};

app.use(middleware);
```

**Request-Response Cycle với Middleware:**

```
Request từ client
    ↓
Middleware 1 (CORS)
    ↓ next()
Middleware 2 (JSON parser)
    ↓ next()
Middleware 3 (Logger)
    ↓ next()
Middleware 4 (Auth)
    ↓ next()
Route Handler
    ↓
Response về client
```

**Middleware có thể:**
- Chạy code bất kỳ
- Sửa đổi req và res objects
- Kết thúc request-response cycle
- Gọi middleware tiếp theo trong stack

#### 6.2 Types of Middleware

**1. Application-level middleware:**
```javascript
app.use((req, res, next) => {
  console.log('Chạy cho mọi request');
  next();
});
```

**2. Router-level middleware:**
```javascript
router.use((req, res, next) => {
  console.log('Chỉ chạy cho routes trong router này');
  next();
});
```

**3. Built-in middleware:**
```javascript
app.use(express.json());        // Parse JSON
app.use(express.urlencoded());  // Parse URL-encoded
app.use(express.static('public')); // Serve static files
```

**4. Third-party middleware:**
```javascript
const cors = require('cors');
app.use(cors());
```

**5. Error-handling middleware:**
```javascript
app.use((err, req, res, next) => {
  // 4 parameters → Express biết đây là error handler
  res.status(500).json({ error: err.message });
});
```

#### 6.3 Error Handling Pattern

**Synchronous errors** - tự động bắt:
```javascript
app.get('/sync-error', (req, res) => {
  throw new Error('Sync error'); // Tự động đi vào error handler
});
```

**Asynchronous errors** - phải dùng next():
```javascript
app.get('/async-error', async (req, res, next) => {
  try {
    await someAsyncOperation();
  } catch (error) {
    next(error); // Pass error to error handler
  }
});
```

### 📁 Files liên quan
- `backend/middleware/auth.js`
- `backend/middleware/errorHandler.js`
- `backend/server.js`

### 💻 Code Explanation

#### Auth Middleware

```javascript
const protect = async (req, res, next) => {
  let token;

  // 1. Extract token từ header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập'
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user từ token payload
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    // 4. Gọi next() để tiếp tục
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }
};
```

**Sử dụng protect middleware:**
```javascript
// Áp dụng cho 1 route
router.get('/todos', protect, getAllTodos);

// Áp dụng cho tất cả routes trong router
router.use(protect);
router.get('/todos', getAllTodos); // Tự động protected
```

**Flow khi có protect:**
```
Request → CORS → JSON Parser → protect middleware
                                    ↓
                          Token hợp lệ?
                          ↓         ↓
                        Yes        No
                          ↓         ↓
                   Set req.user   Return 401
                   next()         (Stop here)
                          ↓
                    Route Handler
                    (Có thể dùng req.user)
```

#### Error Handler Middleware

```javascript
const errorHandler = (err, req, res, next) => {
  // Set status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle specific Mongoose errors

  // 1. CastError - Invalid ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Không tìm thấy tài nguyên';
  }

  // 2. ValidationError - Schema validation failed
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  }

  // 3. Duplicate Key Error - Unique constraint violated
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} đã tồn tại`;
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

**Cách sử dụng trong routes:**
```javascript
router.post('/todos', async (req, res, next) => {
  try {
    // Set status trước khi throw
    if (!req.body.title) {
      res.status(400);
      throw new Error('Title is required');
    }

    const todo = await Todo.create(req.body);
    res.json({ success: true, data: todo });

  } catch (error) {
    next(error); // Forward to error handler
  }
});
```

**Error handler PHẢI đặt SAU tất cả routes:**
```javascript
// server.js

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// 3. Error handler (CUỐI CÙNG)
app.use(errorHandler);
```

### 🔄 Flow Diagram: Error Handling

```
=== NORMAL FLOW ===
Request
    ↓
Middleware 1
    ↓ next()
Middleware 2
    ↓ next()
Route Handler
    ↓
Response

=== ERROR IN MIDDLEWARE ===
Request
    ↓
Middleware 1
    ↓ next()
Middleware 2 → Error occurs
    ↓ next(error)
Skip tất cả middleware/routes
    ↓
Error Handler Middleware
    ↓
Error Response

=== ERROR IN ROUTE ===
Request
    ↓
Middleware 1
    ↓ next()
Middleware 2
    ↓ next()
Route Handler → Error occurs
    ↓ next(error)
Error Handler Middleware
    ↓
Error Response
```

### 🔑 Khái niệm mới

- **Middleware**: Function chạy trong request-response cycle
- **next()**: Function để chuyển control sang middleware tiếp theo
- **Middleware chain**: Chuỗi các middleware chạy tuần tự
- **Error propagation**: Truyền error qua middleware chain
- **Centralized error handling**: Xử lý error ở 1 nơi duy nhất
- **Stack trace**: Thông tin về nơi error xảy ra

### ⚠️ Điểm cần chú ý

1. **Luôn gọi next():**
   ```javascript
   // ❌ Sai - không gọi next()
   app.use((req, res, next) => {
     console.log('Request logged');
     // Forgot next() → request bị stuck
   });

   // ✅ Đúng
   app.use((req, res, next) => {
     console.log('Request logged');
     next(); // Continue
   });
   ```

2. **Middleware order matters:**
   ```javascript
   // ❌ Sai order
   app.use('/api/todos', todoRoutes); // Route trước
   app.use(express.json()); // Parser sau → req.body = undefined

   // ✅ Đúng order
   app.use(express.json()); // Parser trước
   app.use('/api/todos', todoRoutes); // Route sau
   ```

3. **Error handler có 4 parameters:**
   ```javascript
   // ❌ 3 parameters → Normal middleware
   app.use((req, res, next) => {});

   // ✅ 4 parameters → Error handler
   app.use((err, req, res, next) => {});
   ```

4. **Async errors cần next():**
   ```javascript
   // ❌ Error không được bắt
   app.get('/route', async (req, res) => {
     await somethingThatThrows(); // Error không đến error handler
   });

   // ✅ Dùng try-catch + next()
   app.get('/route', async (req, res, next) => {
     try {
       await somethingThatThrows();
     } catch (error) {
       next(error);
     }
   });
   ```

5. **Set status code trước throw:**
   ```javascript
   // Nếu không set, error handler dùng 500
   res.status(404);
   throw new Error('Not found');
   ```

### 🎯 Thực hành

**Bài 1**: Tạo logger middleware
```javascript
const logger = (req, res, next) => {
  const start = Date.now();

  // Log khi response được gửi
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

app.use(logger);
```

**Bài 2**: Tạo rate limiter middleware
```javascript
const rateLimit = {};

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;

  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 1, resetTime: now + windowMs };
    return next();
  }

  if (now > rateLimit[ip].resetTime) {
    rateLimit[ip] = { count: 1, resetTime: now + windowMs };
    return next();
  }

  if (rateLimit[ip].count >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Quá nhiều requests. Vui lòng thử lại sau'
    });
  }

  rateLimit[ip].count++;
  next();
};
```

**Bài 3**: Tạo validation middleware
```javascript
const validateTodo = (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400);
    return next(new Error('Title phải là string'));
  }

  if (title.trim().length === 0) {
    res.status(400);
    return next(new Error('Title không được rỗng'));
  }

  if (title.length > 200) {
    res.status(400);
    return next(new Error('Title không được quá 200 ký tự'));
  }

  next();
};

// Sử dụng
router.post('/todos', protect, validateTodo, createTodo);
```

---

## Phase 7: Frontend Setup

### 🎯 Mục tiêu
Setup React application và hiểu cấu trúc cơ bản

### 📖 Kiến thức cần hiểu

#### 7.1 React là gì?

**React** là JavaScript library để xây dựng UI

**Key concepts:**
- **Component**: Block code tái sử dụng, render UI
- **JSX**: Syntax giống HTML trong JavaScript
- **State**: Dữ liệu thay đổi theo thời gian
- **Props**: Dữ liệu truyền từ parent → child component

**Example component:**
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Sử dụng
<Welcome name="John" />
// Render: <h1>Hello, John</h1>
```

#### 7.2 Create React App

**Setup:**
```bash
npx create-react-app frontend
cd frontend
npm start
```

**Cấu trúc:**
```
frontend/
├── public/
│   └── index.html        # HTML template
├── src/
│   ├── index.js          # Entry point
│   ├── App.js            # Root component
│   └── index.css         # Global styles
└── package.json
```

#### 7.3 React Hooks

**useState** - Quản lý state:
```jsx
const [count, setCount] = useState(0);

// count: giá trị hiện tại
// setCount: function để update count
// useState(0): initial value là 0

setCount(1); // Set count = 1
setCount(count + 1); // Tăng count lên 1
```

**useEffect** - Side effects:
```jsx
useEffect(() => {
  // Code chạy sau mỗi render
  console.log('Component rendered');
}, [dependencies]);

// Empty deps [] → chỉ chạy 1 lần khi mount
useEffect(() => {
  fetchData();
}, []);

// Có deps → chạy khi deps thay đổi
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);
```

**useContext** - Context API:
```jsx
const value = useContext(MyContext);
// Access context value
```

### 📁 Files liên quan
- `frontend/package.json`
- `frontend/src/index.js`
- `frontend/src/App.js`
- `frontend/public/index.html`

### 💻 Code Explanation

#### package.json

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",    // Dev server
    "build": "react-scripts build",    // Production build
    "test": "react-scripts test"       // Run tests
  },
  "proxy": "http://localhost:5000"     // Proxy API requests
}
```

**Proxy setting:**
- Khi gọi `/api/todos`, tự động forward to `http://localhost:5000/api/todos`
- Tránh CORS issues trong development
- Không cần gõ full URL

#### index.js - Entry Point

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

**Giải thích:**
1. **ReactDOM.createRoot()**: Tạo root (React 18+)
2. **document.getElementById('root')**: Lấy div#root từ HTML
3. **StrictMode**: Development mode để phát hiện bugs
4. **AuthProvider**: Context provider cho authentication
5. **App**: Root component

#### index.html

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Todo App</title>
  </head>
  <body>
    <!-- React app được mount vào div này -->
    <div id="root"></div>
  </body>
</html>
```

#### App.js - Root Component

```jsx
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import TodoList from './components/TodoList';

function App() {
  const { isAuthenticated } = useAuth();

  // Conditional rendering
  if (isAuthenticated) {
    return <TodoList />;
  }

  return <Login />;
}

export default App;
```

**Conditional rendering:**
```jsx
// If-else
if (condition) {
  return <ComponentA />;
}
return <ComponentB />;

// Ternary
return condition ? <ComponentA /> : <ComponentB />;

// && operator
return condition && <Component />;
```

### 🔄 Flow Diagram: React Render

```
Browser loads index.html
    ↓
<div id="root"></div>
    ↓
Load JavaScript bundles
    ↓
Run index.js
    ↓
ReactDOM.createRoot(document.getElementById('root'))
    ↓
root.render(<App />)
    ↓
React creates virtual DOM
    ↓
React updates real DOM
    ↓
User sees UI
    ↓
User interacts (click, type, etc.)
    ↓
State changes (setState)
    ↓
Re-render (only affected components)
    ↓
Virtual DOM diff
    ↓
Update real DOM (minimal changes)
    ↓
UI updates
```

### 🔑 Khái niệm mới

- **Component**: Building block của React UI
- **JSX**: JavaScript XML - syntax mở rộng của JS
- **State**: Data thay đổi theo thời gian
- **Props**: Data truyền từ parent to child
- **Hook**: Function để "hook into" React features
- **Virtual DOM**: Representation of UI trong memory
- **Render**: Process tạo UI từ components
- **Re-render**: Update UI khi state/props thay đổi

### ⚠️ Điểm cần chú ý

1. **Component names phải viết hoa:**
   ```jsx
   // ❌ Sai
   function myComponent() {}

   // ✅ Đúng
   function MyComponent() {}
   ```

2. **JSX expressions trong {}:**
   ```jsx
   const name = 'John';
   return <h1>Hello, {name}</h1>; // ✅
   return <h1>Hello, name</h1>;   // ❌ Hiển thị "name" literal
   ```

3. **className thay vì class:**
   ```jsx
   // ❌ Sai
   <div class="container"></div>

   // ✅ Đúng
   <div className="container"></div>
   ```

4. **Tất cả tags phải đóng:**
   ```jsx
   // ❌ Sai
   <img src="...">
   <input type="text">

   // ✅ Đúng
   <img src="..." />
   <input type="text" />
   ```

5. **Return 1 parent element:**
   ```jsx
   // ❌ Sai - nhiều root elements
   return (
     <h1>Title</h1>
     <p>Text</p>
   );

   // ✅ Đúng - wrap trong 1 parent
   return (
     <div>
       <h1>Title</h1>
       <p>Text</p>
     </div>
   );

   // ✅ Hoặc dùng Fragment
   return (
     <>
       <h1>Title</h1>
       <p>Text</p>
     </>
   );
   ```

### 🎯 Thực hành

**Bài 1**: Tạo component Counter
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**Bài 2**: Component với props
```jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Sử dụng
<Greeting name="John" age={25} />
```

**Bài 3**: useEffect để fetch data
```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []); // Empty deps → chỉ fetch 1 lần

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

*Tiếp tục với Phase 8, 9, 10 trong phần tiếp theo do giới hạn độ dài...*

## Phase 8: React Components

### 🎯 Mục tiêu
Xây dựng các React components cho Todo App

### 📖 Kiến thức cần hiểu

#### 8.1 Component Communication

**Parent → Child: Props**
```jsx
// Parent
<TodoItem todo={todo} onDelete={handleDelete} />

// Child
function TodoItem({ todo, onDelete }) {
  return (
    <div>
      <span>{todo.title}</span>
      <button onClick={() => onDelete(todo._id)}>Xóa</button>
    </div>
  );
}
```

**Child → Parent: Callback props**
```jsx
// Parent defines callback
const handleDelete = (id) => {
  // Logic xóa todo
};

// Pass to child
<TodoItem onDelete={handleDelete} />

// Child calls callback
<button onClick={() => onDelete(todo._id)}>
```

#### 8.2 Controlled Components

```jsx
// ❌ Uncontrolled - DOM giữ state
<input type="text" />

// ✅ Controlled - React giữ state
const [value, setValue] = useState('');
<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### 💻 Code Explanation

#### TodoForm Component

```jsx
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn reload page

    if (!title.trim()) return; // Validate

    onAddTodo(title); // Call parent callback
    setTitle(''); // Reset input
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thêm todo..."
      />
      <button type="submit">Thêm</button>
    </form>
  );
}
```

**Key points:**
- `value={title}`: Controlled input
- `onChange`: Update state khi user gõ
- `onSubmit`: Handle form submission
- `e.preventDefault()`: Prevent default form behavior

#### TodoItem Component

```jsx
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id)}
      />
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
      }}>
        {todo.title}
      </span>
      <button onClick={() => onDelete(todo._id)}>Xóa</button>
    </div>
  );
}
```

**Inline styles:**
```jsx
style={{
  textDecoration: todo.completed ? 'line-through' : 'none',
  color: todo.completed ? '#999' : '#333'
}}
```

#### TodoList Component

```jsx
import { useState, useEffect } from 'react';
import * as api from '../services/api';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos khi mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTodo = async (title) => {
    try {
      const newTodo = await api.createTodo(title);
      setTodos([newTodo, ...todos]); // Prepend
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await api.toggleTodo(id);
      setTodos(todos.map(t => t._id === id ? updated : t));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa todo?')) return;

    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(t => t._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      {todos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

**State update patterns:**
```jsx
// Thêm mới vào đầu
setTodos([newItem, ...todos]);

// Update 1 item
setTodos(todos.map(t => t.id === id ? updatedItem : t));

// Xóa 1 item
setTodos(todos.filter(t => t.id !== id));

// Sort
setTodos([...todos].sort((a, b) => a.order - b.order));
```

### 🔄 Component Tree & Data Flow

```
App
 └─ TodoList
     ├─ TodoForm
     │   └─ onAddTodo={handleAddTodo} (callback)
     │
     └─ TodoItem (multiple)
         ├─ todo={todo} (data down)
         ├─ onToggle={handleToggle} (callback up)
         └─ onDelete={handleDelete} (callback up)

Data flow:
1. User gõ vào TodoForm input
2. onChange → setTitle (local state)
3. User submit form
4. onAddTodo(title) → call parent TodoList
5. TodoList.handleAddTodo → API call
6. API success → setTodos (update state)
7. React re-render TodoList
8. New TodoItem appears
```

### ⚠️ Điểm cần chú ý

1. **key prop trong list:**
   ```jsx
   // ❌ Sai - dùng index
   {todos.map((todo, index) => (
     <TodoItem key={index} todo={todo} />
   ))}

   // ✅ Đúng - dùng unique ID
   {todos.map(todo => (
     <TodoItem key={todo._id} todo={todo} />
   ))}
   ```

2. **State immutability:**
   ```jsx
   // ❌ Sai - mutate state directly
   todos.push(newTodo);
   setTodos(todos);

   // ✅ Đúng - create new array
   setTodos([...todos, newTodo]);
   ```

3. **Async trong useEffect:**
   ```jsx
   // ❌ Sai - useEffect callback không thể async
   useEffect(async () => {
     await fetchData();
   }, []);

   // ✅ Đúng - tạo async function bên trong
   useEffect(() => {
     const loadData = async () => {
       await fetchData();
     };
     loadData();
   }, []);
   ```

### 🎯 Thực hành

**Bài 1**: Thêm filter (All/Active/Completed)
**Bài 2**: Thêm edit todo inline
**Bài 3**: Thêm loading state cho mỗi action

---

## Phase 9: API Integration

### 🎯 Mục tiêu
Tích hợp React frontend với Express backend API

### 📖 Kiến thức cần hiểu

#### 9.1 Fetch API

```jsx
// GET request
const response = await fetch('/api/todos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();

// POST request
const response = await fetch('/api/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ title: 'New todo' })
});
```

#### 9.2 Context API

```jsx
// Create context
const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

// Consumer
export function useAuth() {
  return useContext(AuthContext);
}

// Usage
const { user, login } = useAuth();
```

### 💻 Code Explanation

#### api.js Service

```jsx
const API_URL = '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const getTodos = async () => {
  const res = await fetch(`${API_URL}/todos`, {
    headers: getAuthHeader()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
};

export const createTodo = async (title) => {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ title })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
};
```

#### AuthContext

```jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 🔄 Full Integration Flow

```
User opens app
    ↓
React loads
    ↓
AuthProvider checks localStorage for token
    ↓
Token exists?
    ↓ Yes
GET /api/auth/me with token
    ↓
Backend verify token
    ↓
Return user data
    ↓
setUser(data)
    ↓
isAuthenticated = true
    ↓
App renders TodoList
    ↓
TodoList fetches todos
    ↓
GET /api/todos with token
    ↓
Backend returns todos
    ↓
setTodos(data)
    ↓
UI renders todo list
```

### ⚠️ Điểm cần chú ý

1. **Handle errors:**
   ```jsx
   try {
     const data = await api.getTodos();
     setTodos(data);
   } catch (error) {
     console.error(error);
     alert(error.message);
   }
   ```

2. **Loading states:**
   ```jsx
   const [loading, setLoading] = useState(false);

   const handleSubmit = async () => {
     setLoading(true);
     try {
       await api.createTodo(title);
     } finally {
       setLoading(false);
     }
   };
   ```

3. **Token refresh:**
   - Trong production, implement refresh token
   - Auto-logout khi token expired

### 🎯 Thực hành

**Bài 1**: Thêm error boundary
**Bài 2**: Implement retry logic
**Bài 3**: Add toast notifications

---

## Phase 10: Full Integration & Testing

### 🎯 Mục tiêu
Chạy full-stack app và test toàn bộ features

### 📖 Checklist Setup

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Sửa .env với MongoDB URI và JWT_SECRET
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

### 🧪 Testing Checklist

- [ ] Đăng ký user mới
- [ ] Đăng nhập
- [ ] Tạo todo
- [ ] Toggle todo completed
- [ ] Xóa todo
- [ ] Refresh page (check token persist)
- [ ] Đăng xuất

### 🚀 Next Steps

1. Deploy backend to Heroku/Railway
2. Deploy frontend to Vercel/Netlify
3. Add features: search, categories, due dates
4. Improve UI với Tailwind/Material-UI
5. Add tests với Jest

---

## 📚 Resources

- [Node.js Docs](https://nodejs.org/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [React Docs](https://react.dev)
- [JWT.io](https://jwt.io)

---

## ❓ Common Issues & Solutions

**Issue 1: Port already in use**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Issue 2: CORS errors**
```javascript
// Backend: Đảm bảo CORS middleware đúng origin
app.use(cors({ origin: 'http://localhost:3000' }));
```

**Issue 3: Token not sent**
```javascript
// Kiểm tra localStorage có token không
console.log(localStorage.getItem('token'));

// Kiểm tra header
console.log(request.headers.authorization);
```

**Issue 4: MongoDB connection failed**
- Check MongoDB đang chạy
- Check connection string đúng
- Check network access (MongoDB Atlas)

---

Chúc bạn học tốt! 🎉
