# 🐳 Hướng dẫn MongoDB Docker + MongoDB Compass

## 🚀 Bước 1: Chạy MongoDB với Docker (2 phút)

```bash
# Vào thư mục project
cd d:/Learn/BE/sample/todo-app-docker-mongo

# Start MongoDB container
docker-compose up -d

# Kiểm tra container đang chạy
docker ps
```

✅ MongoDB đang chạy tại: `localhost:27017`

---

## 📊 Bước 2: Cài MongoDB Compass (3 phút)

1. **Download**: https://www.mongodb.com/try/download/compass
2. **Cài đặt**: Next → Next → Install
3. **Mở Compass**

---

## 🔌 Bước 3: Kết nối với MongoDB Compass

### Connection String:
```
mongodb://admin:admin123@localhost:27017/todoapp?authSource=admin
```

### Hoặc điền thủ công:
- **Host**: `localhost`
- **Port**: `27017`
- **Authentication**: Username / Password
- **Username**: `admin`
- **Password**: `admin123`
- **Authentication Database**: `admin`

Click **Connect** → Vào database `todoapp` → Xem collections (`users`, `todos`)

---

## 🛠️ Lệnh Docker hữu ích

```bash
# Stop MongoDB
docker-compose down

# Stop và xóa data
docker-compose down -v

# Xem logs
docker-compose logs -f mongodb

# Restart
docker-compose restart
```

---

**Xong!** Giờ có thể xem data trong MongoDB Compass! 🎉
