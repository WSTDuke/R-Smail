// src/App.js
// Component gốc của React app

import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TodoList from './components/todo/TodoList';

/**
 * APP COMPONENT
 *
 * Component gốc quản lý routing đơn giản:
 * - Nếu chưa login → hiển thị Login/Register
 * - Nếu đã login → hiển thị TodoList
 */
const App = () => {
  /**
   * STATE - Chuyển đổi giữa Login và Register
   */
  const [showRegister, setShowRegister] = useState(false);

  /**
   * Lấy auth state từ AuthContext
   */
  const { isAuthenticated } = useAuth();

  /**
   * RENDER
   */

  // Nếu đã login → hiển thị TodoList
  if (isAuthenticated) {
    return <TodoList />;
  }

  // Nếu chưa login → hiển thị Login hoặc Register
  return (
    <div>
      {showRegister ? (
        <Register
          onSwitchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onSwitchToRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  );
};

export default App;

/**
 * FLOW HOẠT ĐỘNG:
 *
 * 1. App load → AuthProvider kiểm tra localStorage
 *
 * 2. Nếu không có token:
 *    - isAuthenticated = false
 *    - Hiển thị Login
 *    - User click "Đăng ký" → setShowRegister(true) → hiển thị Register
 *    - User đăng ký/đăng nhập thành công
 *    - AuthContext set user → isAuthenticated = true
 *    - App re-render → hiển thị TodoList
 *
 * 3. Nếu có token hợp lệ:
 *    - AuthProvider verify token
 *    - Set user
 *    - isAuthenticated = true
 *    - App hiển thị TodoList ngay
 *
 * 4. User click "Đăng xuất":
 *    - logout() xóa token
 *    - Set user = null
 *    - isAuthenticated = false
 *    - App re-render → hiển thị Login
 *
 * COMPONENT TREE:
 *
 * App
 *  ├─ (chưa login)
 *  │   ├─ Login
 *  │   └─ Register
 *  └─ (đã login)
 *      └─ TodoList
 *           ├─ TodoForm
 *           └─ TodoItem (multiple)
 *
 * SIMPLE ROUTING:
 *
 * Thay vì dùng React Router, app này dùng conditional rendering:
 * - isAuthenticated ? <TodoList /> : <Login />
 * - showRegister ? <Register /> : <Login />
 *
 * Đơn giản nhưng đủ cho app nhỏ
 */
