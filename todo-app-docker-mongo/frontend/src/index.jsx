// src/index.js
// Entry point của React app

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

/**
 * RENDER APP
 *
 * 1. Tạo root element
 * 2. Wrap App với AuthProvider để cung cấp auth context
 * 3. Render vào DOM
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

/**
 * GIẢI THÍCH:
 *
 * 1. ReactDOM.createRoot():
 *    - React 18+ dùng createRoot thay vì render
 *    - Tạo root từ DOM element có id="root"
 *
 * 2. React.StrictMode:
 *    - Component wrapper để phát hiện lỗi
 *    - Chỉ chạy trong development
 *    - Giúp tìm bugs và anti-patterns
 *
 * 3. AuthProvider:
 *    - Wrap toàn bộ app
 *    - Cung cấp auth context cho tất cả components
 *    - Mọi component có thể dùng useAuth()
 *
 * COMPONENT HIERARCHY:
 *
 * StrictMode
 *   └─ AuthProvider
 *        └─ App
 *             ├─ Login/Register (nếu chưa login)
 *             └─ TodoList (nếu đã login)
 *
 * CONTEXT FLOW:
 *
 * AuthProvider tạo context value:
 * {
 *   user,
 *   loading,
 *   error,
 *   register,
 *   login,
 *   logout,
 *   isAuthenticated
 * }
 *
 * Bất kỳ component nào cũng có thể:
 * const { user, login, logout } = useAuth();
 */
