## 📖 Giới thiệu

**R-Nmail** (R-Smail) là một ứng dụng web quản lý thư và công việc được xây dựng theo phong cách giao diện Gmail. Người dùng có thể soạn thư, gửi thư đến người dùng khác trong hệ thống, phân loại thư theo thư mục, đánh dấu quan trọng, và tạm hoãn các mục cần xử lý sau.

**Dự án này phù hợp để học:**

- Kiến trúc **Controller → Service → Repository → Model** (Clean Architecture)
- **JWT Authentication** với bcrypt password hashing
- **MongoDB với Docker** (không cần cài MongoDB trực tiếp)
- **React Context API** cho state management
- Fullstack **React + Node.js/Express** end-to-end

### Demo

> [TODO] Thêm screenshot hoặc GIF demo ở đây

---

## ✨ Tính năng chính

- [x] **Đăng ký / Đăng nhập** với JWT Authentication
- [x] **Thư mục Hộp thư đến** (Inbox) — nhận thư từ người khác
- [x] **Thư đã gửi** (Sent) — xem lại thư đã gửi đi
- [x] **Thư quan trọng** (Starred) — đánh dấu thư/mục quan trọng
- [x] **Tạm hoãn** (Snoozed) — ẩn tạm mục để xử lý sau
- [x] **Thùng rác** (Trash) — xóa và khôi phục
- [x] **Soạn thư mới** — gửi thư đến người dùng khác qua email
- [x] **Toggle hoàn thành** — đánh dấu đã đọc/xử lý
- [x] **Xóa hàng loạt** (Bulk delete) theo danh sách ID
- [x] **Xóa tất cả đã hoàn thành** chỉ bằng một thao tác
- [x] **Thống kê** (Stats) — endpoint tổng hợp số liệu mục
- [x] **Tìm kiếm** (UI) theo nội dung thư
- [x] **Giao diện Gmail-inspired** với sidebar điều hướng
- [x] **Persistent login** — lưu token trong `localStorage`

---

## 🛠️ Tech Stack

### Frontend

| Công nghệ         | Phiên bản | Mục đích                  |
| ----------------- | --------- | ------------------------- |
| React             | ^18.2.0   | UI library                |
| react-scripts     | 5.0.1     | Build toolchain (CRA)     |
| TailwindCSS       | ^3.4.19   | Utility-first CSS         |
| lucide-react      | ^0.564.0  | Icon library              |
| Fetch API         | Native    | HTTP client (gọi backend) |
| React Context API | Built-in  | Auth state management     |

### Backend

| Công nghệ    | Phiên bản | Mục đích              |
| ------------ | --------- | --------------------- |
| Node.js      | ≥ 18.x    | Runtime               |
| Express      | ^4.18.2   | Web framework         |
| Mongoose     | ^7.6.3    | MongoDB ODM           |
| bcryptjs     | ^2.4.3    | Password hashing      |
| jsonwebtoken | ^9.0.2    | JWT authentication    |
| dotenv       | ^16.3.1   | Environment variables |
| cors         | ^2.8.5    | Cross-origin requests |
| nodemon      | ^3.0.1    | Dev hot-reload        |

### DevOps / Database

| Công nghệ               | Phiên bản | Mục đích                 |
| ----------------------- | --------- | ------------------------ |
| MongoDB                 | 7.0       | Database                 |
| Docker / Docker Compose | 3.8       | MongoDB containerization |
| MongoDB Compass         | [TODO]    | GUI quản lý database     |

---

## 📁 Cấu trúc thư mục

```
todo-app-docker-mongo/
├── backend/                        # Node.js/Express API server
│   ├── config/
│   │   └── db.js                   # Kết nối MongoDB qua Mongoose
│   ├── controllers/
│   │   ├── AuthController.js       # Xử lý register, login, getMe, getUsers
│   │   └── TodoController.js       # Xử lý CRUD + toggle/star/snooze
│   ├── middleware/
│   │   ├── auth.js                 # JWT middleware (protect route)
│   │   └── errorHandler.js         # Global error handler
│   ├── models/
│   │   ├── User.js                 # Schema user (name, email, password + bcrypt)
│   │   └── Todo.js                 # Schema thư (title, folder, starred, sender, recipient...)
│   ├── repositories/
│   │   ├── UserRepository.js       # Database operations cho User
│   │   └── TodoRepository.js       # Database operations cho Todo
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   └── todoRoutes.js           # /api/todos/*
│   ├── services/
│   │   ├── AuthService.js          # Business logic authentication
│   │   └── TodoService.js          # Business logic todo/mail
│   ├── .env                        # Biến môi trường (không commit)
│   ├── .env.example                # Template biến môi trường
│   ├── package.json
│   └── server.js                   # Entry point, khởi động Express server
│
├── frontend/                       # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx       # Form đăng nhập
│   │   │   │   └── Register.jsx    # Form đăng ký
│   │   │   ├── layout/             # Layout components
│   │   │   ├── todo/               # Todo/Mail list, form, item components
│   │   │   └── GmailLayout.jsx     # Shell layout chính (header + sidebar + main)
│   │   ├── constants/              # Hằng số dùng chung (folder names, v.v.)
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # React Context quản lý auth state + token
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/
│   │   │   └── api.jsx             # Tất cả hàm gọi API backend (Fetch API)
│   │   ├── App.jsx                 # Root component, routing auth/app
│   │   ├── index.jsx               # Entry point React
│   │   └── index.css               # Global styles + CSS variables
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml              # MongoDB Docker container
├── mongo-init.js                   # Script khởi tạo DB ban đầu
└── README.md
```

---

## ⚙️ Yêu cầu hệ thống

| Công cụ        | Phiên bản tối thiểu |
| -------------- | ------------------- |
| Node.js        | >= 18.x             |
| npm            | >= 9.x              |
| Docker Desktop | >= 4.x              |
| Docker Compose | >= 2.x              |

---

## 🚀 Cài đặt & Chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/username/R-Nmail.git
cd R-Nmail/todo-app-docker-mongo
```

### 2. Khởi động MongoDB với Docker

```bash
# Chạy container MongoDB (port 27017)
docker-compose up -d

# Kiểm tra container đang chạy
docker ps
```

### 3. Cài đặt dependencies cho backend

```bash
cd backend
npm install
```

### 4. Cấu hình biến môi trường

```bash
# Tạo file .env từ template
cp .env.example .env
```

Chỉnh sửa `.env` theo cấu hình của bạn (xem bảng [Biến môi trường](#-biến-môi-trường-env) bên dưới).

### 5. Cài đặt dependencies cho frontend

```bash
cd ../frontend
npm install
```

### 6. Chạy development

```bash
# Terminal 1 — Backend (trong thư mục backend/)
cd backend
npm run dev

# Terminal 2 — Frontend (trong thư mục frontend/)
cd frontend
npm start
```

### 7. Truy cập ứng dụng

| Service      | URL                              |
| ------------ | -------------------------------- |
| Frontend     | http://localhost:3000            |
| Backend API  | http://localhost:5000            |
| Health Check | http://localhost:5000/api/health |

---

## 🔧 Biến môi trường (.env)

Tạo file `.env` trong thư mục `backend/` dựa trên `.env.example`:

| Biến          | Mô tả                                           | Ví dụ                                                               |
| ------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| `MONGODB_URI` | Connection string MongoDB Docker                | `mongodb://admin:admin123@localhost:27017/todoapp?authSource=admin` |
| `PORT`        | Port chạy Express server                        | `5000`                                                              |
| `JWT_SECRET`  | Secret key để ký JWT token (tối thiểu 32 ký tự) | `your_super_secret_key_change_this_min_32_characters_long_123456`   |
| `NODE_ENV`    | Môi trường chạy ứng dụng                        | `development`                                                       |

> ⚠️ **Lưu ý**: Thay đổi `JWT_SECRET` thành một chuỗi ngẫu nhiên đủ mạnh trước khi deploy production.

---

## 📡 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint             | Mô tả                                              | Auth |
| ------ | -------------------- | -------------------------------------------------- | ---- |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới `{ name, email, password }`  | ❌   |
| `POST` | `/api/auth/login`    | Đăng nhập `{ email, password }` → trả về JWT token | ❌   |
| `GET`  | `/api/auth/me`       | Lấy thông tin user hiện tại                        | ✅   |
| `GET`  | `/api/auth/users`    | Lấy danh sách tất cả users                         | ✅   |

### Todos/Mail (`/api/todos`)

> Tất cả routes `/api/todos/*` đều yêu cầu JWT Bearer Token.

| Method   | Endpoint                     | Mô tả                                                          |
| -------- | ---------------------------- | -------------------------------------------------------------- |
| `GET`    | `/api/todos?folder=inbox`    | Lấy danh sách thư theo thư mục                                 |
| `GET`    | `/api/todos/stats`           | Lấy thống kê số lượng thư                                      |
| `GET`    | `/api/todos/:id`             | Lấy chi tiết một thư                                           |
| `POST`   | `/api/todos`                 | Tạo thư mới / gửi thư `{ title, description, recipientEmail }` |
| `PUT`    | `/api/todos/:id`             | Cập nhật nội dung thư                                          |
| `PATCH`  | `/api/todos/:id/toggle`      | Toggle trạng thái đã đọc/hoàn thành                            |
| `PATCH`  | `/api/todos/:id/toggle-star` | Toggle đánh dấu quan trọng                                     |
| `PATCH`  | `/api/todos/:id/snooze`      | Tạm ẩn thư (chuyển sang folder `snoozed`)                      |
| `PATCH`  | `/api/todos/:id/unsnooze`    | Hoàn tác tạm ẩn                                                |
| `DELETE` | `/api/todos/:id`             | Xóa một thư                                                    |
| `DELETE` | `/api/todos/bulk`            | Xóa nhiều thư `{ ids: [...] }`                                 |
| `DELETE` | `/api/todos`                 | Xóa tất cả thư đã hoàn thành                                   |
| `GET`    | `/api/health`                | Kiểm tra trạng thái server                                     |

### Ví dụ Response

```json
// POST /api/todos
{
  "success": true,
  "data": {
    "_id": "673def456",
    "title": "Tiêu đề thư",
    "description": "Nội dung thư",
    "completed": false,
    "starred": false,
    "folder": "inbox",
    "user": "673abc123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🏗️ Kiến trúc hệ thống

Dự án áp dụng **Clean Architecture** theo pattern 4 tầng:

```
HTTP Request
    ↓
Routes          → Định nghĩa endpoints, áp dụng middleware
    ↓
Controller      → Nhận request, gọi service, trả response
    ↓
Service         → Business logic, validation, authorization
    ↓
Repository      → CRUD operations thuần túy với database
    ↓
Model           → Mongoose schema, validation, hooks
    ↓
MongoDB (Docker)
```

### Luồng Authentication

```
Frontend                       Backend
─────────────────────────────────────────────────
Login form  ──POST /api/auth/login──►  AuthController
                                           ↓ AuthService
                                           ↓ AuthRepository (verify password bcrypt)
                                           ↓ Tạo JWT token
            ◄── { token, user } ──────── Response
localStorage.setItem('token')
Mọi request tiếp theo: Authorization: Bearer <token>
                                           ↓
                                    middleware/auth.js (verify JWT)
                                           ↓ req.user = decoded payload
                                    Controller → Service → Repository → Model
```

### Luồng Giao Diện (React)

```
index.jsx
  └── AuthProvider (Context)
        └── App.jsx
              ├── (chưa login) → Login / Register
              └── (đã login)  → GmailLayout
                                   ├── Header (search, user avatar, logout)
                                   ├── Sidebar (Inbox / Starred / Sent / Drafts)
                                   └── TodoList (danh sách thư theo folder)
                                         └── TodoItem (mỗi thư)
```

---

## 🐳 Docker — MongoDB

File `docker-compose.yml` khởi động MongoDB 7.0 với:

```yaml
services:
  mongodb:
    image: mongo:7.0
    container_name: todo-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: todoapp
```

```bash
# Khởi động
docker-compose up -d

# Dừng
docker-compose down

# Xem logs
docker logs todo-mongodb
```

---

## 🗄️ Data Models

### User

```js
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, min 6 ký tự, hashed bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Todo (Mail)

```js
{
  title: String (required, max 200 ký tự),
  description: String,
  completed: Boolean (default: false),
  starred: Boolean (default: false),
  folder: Enum ['inbox', 'sent', 'starred', 'trash', 'snoozed'] (default: 'inbox'),
  user: ObjectId → User,         // chủ sở hữu
  sender: ObjectId → User,       // người gửi
  recipient: ObjectId → User,    // người nhận
  recipientEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📦 Build Production

```bash
# Build frontend
cd frontend
npm run build

# Chạy backend production
cd backend
npm start
```

---

## 🧪 Chạy Tests

```bash
# Frontend (CRA test runner)
cd frontend
npm test
```

> [TODO] Unit tests cho backend Service layer chưa được implement. Xem `ARCHITECTURE_FLOW.md` để tham khảo cách viết tests.

---

## 📚 Tài liệu bổ sung

Xem thêm trong thư mục `workflow/`:

| File                                                              | Nội dung                                                    |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| [`ARCHITECTURE_FLOW.md`](./workflow/ARCHITECTURE_FLOW.md)         | Giải thích chi tiết luồng Controller → Service → Repository |
| [`START_HERE.md`](./workflow/START_HERE.md)                       | Hướng dẫn bắt đầu nhanh                                     |
| [`LEARNING_GUIDE.md`](./workflow/LEARNING_GUIDE.md)               | Tài liệu học tập kèm theo dự án                             |
| [`MONGODB_COMPASS_SETUP.md`](./workflow/MONGODB_COMPASS_SETUP.md) | Cấu hình MongoDB Compass                                    |
| [`CHON_SQLITE.md`](./workflow/CHON_SQLITE.md)                     | So sánh SQLite vs MongoDB                                   |

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m 'Add: mô tả tính năng'`
4. Push lên branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 📄 License

ISC License — xem file `package.json` để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

> [TODO] Thêm thông tin tác giả từ `git config` hoặc `package.json`

---

<div align="center">
  <sub>Built with ❤️ using React + Node.js + MongoDB Docker</sub>
</div>
